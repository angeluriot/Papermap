import 'dotenv/config';
import fs from 'fs';
import { join } from 'path';


const email = process.env.VITE_OPENALEX_EMAIL ?? '';
const [, , map_id] = process.argv;
const nb_per_page = 90;


function clean_id(id)
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


async function get_map(id)
{
	async function walk_directory(dir)
	{
		const entries = await fs.promises.readdir(dir, { withFileTypes: true });

		for (const entry of entries)
		{
			const full_path = join(dir, entry.name);

			if (entry.isDirectory())
			{
				const result = await walk_directory(full_path);

				if (result)
					return result;
			}

			else if (entry.isFile() && entry.name === `${id}.json`)
				return full_path;
		}

		return null;
	}

	const file_path = await walk_directory(join(process.cwd(), 'data', 'maps'));

	if (!file_path)
		return null;

	const content = await fs.promises.readFile(file_path, 'utf-8');
	return JSON.parse(content);
}


async function api_find_paper_ids(papers)
{
	const ids = papers.filter(paper => paper.id).toSorted((a, b) => b.year - a.year).slice(0, nb_per_page).map(paper => paper.id);

	let query = new URLSearchParams({
		'filter': 'openalex:' + ids.join('|'),
		'select': 'referenced_works',
		'mailto': email,
		'per-page': nb_per_page.toString(),
	});

	let response = await fetch('https://api.openalex.org/works?' + query.toString());

	if (!response.ok)
	{
		console.error('API Error:', response.status, response.statusText, await response.json());
		process.exit(1);
	}

	return (await response.json()).results;
}


async function api_get_papers(paper_ids)
{
	const ids = paper_ids.slice(0, nb_per_page);

	let query = new URLSearchParams({
		'filter': 'openalex:' + ids.join('|'),
		'select': 'id,title,doi',
		'mailto': email,
		'per-page': nb_per_page.toString(),
	});

	let response = await fetch('https://api.openalex.org/works?' + query.toString());

	if (!response.ok)
	{
		console.error('API Error:', response.status, response.statusText, await response.json());
		process.exit(1);
	}

	return (await response.json()).results;
}


async function main()
{
	const map = await get_map(map_id);
	const results = await api_find_paper_ids(map.papers);
	let map_ids = new Set(map.papers.filter(paper => paper.id).map(paper => paper.id));
	let papers_dict = {};

	for (const result of results)
	{
		for (const id of result.referenced_works)
		{
			if (!id || id.length === 0)
				continue;

			const cleaned_id = clean_id(id);

			if (map_ids.has(cleaned_id))
				continue;

			if (papers_dict[cleaned_id] === undefined)
				papers_dict[cleaned_id] = 0;

			papers_dict[cleaned_id]++;
		}
	}

	const paper_ids = Object.entries(papers_dict).toSorted((a, b) => b[1] - a[1]).map(entry => entry[0]);
	const paper_results = await api_get_papers(paper_ids);
	const papers = paper_results.map(paper => ({
		title: paper.title,
		doi: paper.doi,
		nb: paper.id && paper.id.length > 0 ? papers_dict[clean_id(paper.id)] : 0,
	})).toSorted((a, b) => a.nb - b.nb);

	for (const paper of papers)
	{
		console.log('(' + paper.nb + ') ' + paper.title);
		console.log(paper.doi, '\n');
	}

	process.exit(0);
}


await main();
