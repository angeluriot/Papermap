import 'dotenv/config';
import fs from 'fs';
import { join } from 'path';


const nb_per_page = 200;
const max_results = 50_000;
const coefs = {
	year: 1.0,
	journal: 10.0,
	citations: 1.0,
	review_type: 2.0,
	type: 2.0,
};

const email = process.env.VITE_OPENALEX_EMAIL ?? '';
const [, , title_search, abstract_search, text_search] = process.argv;


export function clamp(value, min, max)
{
	return Math.max(min, Math.min(max, value));
}


export function ratio(value, min, max, cut = true)
{
	if (min >= max)
		throw new Error('min must be less than max');

	const result = (value - min) / (max - min);

	return cut ? clamp(result, 0, 1) : result;
}


export function clean_id(id)
{
	let cleaned_id = id;

	if (cleaned_id.startsWith('openalex.org/'))
		return cleaned_id.replace('openalex.org/', '').trim();

	if (cleaned_id.startsWith('http://openalex.org/'))
		return cleaned_id.replace('http://openalex.org/', '').trim();

	if (cleaned_id.startsWith('https://openalex.org/'))
		return cleaned_id.replace('https://openalex.org/', '').trim();

	if (cleaned_id.startsWith('www.openalex.org/'))
		return cleaned_id.replace('www.openalex.org/', '').trim();

	if (cleaned_id.startsWith('http://www.openalex.org/'))
		return cleaned_id.replace('http://www.openalex.org/', '').trim();

	if (cleaned_id.startsWith('https://www.openalex.org/'))
		return cleaned_id.replace('https://www.openalex.org/', '').trim();

	while (cleaned_id.startsWith('/'))
		cleaned_id = cleaned_id.substring(1).trim();

	while (cleaned_id.endsWith('/'))
		cleaned_id = cleaned_id.substring(0, cleaned_id.length - 1).trim();

	return cleaned_id.toUpperCase().trim();
}


async function api_call()
{
	let search = [];

	if (title_search && title_search.length > 0)
		search.push('title.search:' + title_search);

	if (abstract_search && abstract_search.length > 0)
		search.push('title_and_abstract.search:' + abstract_search);

	if (text_search && text_search.length > 0)
		search.push('fulltext.search:' + text_search);

	let query = new URLSearchParams({
		'filter': search.join(','),
		'mailto': email,
		'sort': 'cited_by_count:desc',
		'per-page': nb_per_page.toString(),
		'cursor': '*',
	});

	let response = await fetch('https://api.openalex.org/works?' + query.toString());

	if (!response.ok)
	{
		console.error('API Error:', response.status, response.statusText, await response.json());
		process.exit(1);
	}

	response = await response.json();

	if (response.meta.count <= nb_per_page)
		return response.results;

	let results = response.results;

	for (let i = 2; i <= Math.ceil(Math.min(response.meta.count, max_results) / nb_per_page); i++)
	{
		if (!response.meta.next_cursor)
		{
			console.error('Cursor error');
			process.exit(1);
		}

		query.set('cursor', response.meta.next_cursor);
		response = await fetch('https://api.openalex.org/works?' + query.toString());

		if (!response.ok)
		{
			console.error('API Error:', response.status, response.statusText, await response.json());
			process.exit(1);
		}

		response = await response.json();
		results.push(...response.results);
		await new Promise(resolve => setTimeout(resolve, 100));
	}

	return results;
}


export async function get_journal(index, id)
{
	const result = index[id];

	if (result === undefined)
		return null;

	const [start, length] = result;
	const file = await fs.promises.open(join(process.cwd(), 'data', 'journals', 'data.jsonl'), 'r');
	const buffer = Buffer.alloc(length);
	await file.read(buffer, 0, length, start);
	await file.close();

	return JSON.parse(buffer.toString('utf-8'));
}


export async function get_journal_from_work(index, work)
{
	if (work?.is_retracted)
		return null;

	for (const location of work?.locations ?? [])
	{
		if (!location?.source?.id)
			continue;

		let journal = await get_journal(index, clean_id(location.source.id));

		if (journal !== null)
			return journal;
	}

	return null;
}


async function main()
{
	console.log(`Searching for works with title: "${title_search}", abstract: "${abstract_search}" and text: "${text_search}"...`);

	let results = await api_call();

	if (results.length === 0)
	{
		console.log('No results found.');
		process.exit(0);
	}

	const index = JSON.parse(await fs.promises.readFile(join(process.cwd(), 'data', 'journals', 'index.json'), 'utf-8'));
	let papers = [];

	for (const work of results)
	{
		let year = work?.publication_year ? ratio(work?.publication_year, 1900, new Date().getFullYear()) : 0.0;

		let journal = await get_journal_from_work(index, work);
		journal = journal ? journal.score : 0.0;

		let citations = work?.cited_by_count ?? 0.0;
		citations /= 50;
		citations /= citations + 1.0;

		const clean_title = (work?.title ?? '').toLowerCase().replace(/[^a-z]/g, '')
		let review_type = 0.0;

		if (clean_title.includes('metaanalysis'))
			review_type = 1.0;

		else if (clean_title.includes('systematicreview'))
			review_type = 2.0 / 3.0;

		else if (clean_title.includes('narrativereview') || clean_title.includes('literaturereview') || work?.type === 'review')
			review_type = 1.0 / 3.0;

		let type = 0.2;

		if (clean_title.includes('blindedrandomizedcontrolledtrial') || clean_title.includes('blindedrct') || clean_title.includes('blindedrandomizedcontroltrial'))
			type = 1.0;

		else if (clean_title.includes('randomizedcontrolledtrial') || (work?.title ?? '').includes('RCT'))
			type = 0.8;

		else if (clean_title.includes('clinicaltrial'))
			type = 0.4;

		else if (clean_title.includes('cohort'))
			type = 0.4;

		else if (clean_title.includes('crosssectional'))
			type = 0.2;

		else if (clean_title.includes('casereport'))
			type = 0.0;

		const score = (
			year * coefs.year +
			journal * coefs.journal +
			citations * coefs.citations +
			review_type * coefs.review_type +
			type * coefs.type
		) / (
			coefs.year + coefs.journal + coefs.citations + coefs.review_type + coefs.type
		);

		papers.push({ title: work?.title, doi: work?.doi, score: score });
	}

	papers.sort((a, b) => a.score - b.score);
	papers = papers.slice(papers.length - 100);

	for (const paper of papers)
	{
		console.log(paper.title);
		console.log(paper.doi, '\n');
	}

	process.exit(0);
}


await main();
