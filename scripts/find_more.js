import 'dotenv/config';
import fs from 'fs';
import { join } from 'path';


const email = process.env.VITE_OPENALEX_EMAIL ?? '';
const map_id = process.argv[2];
const only_reviews = process.argv[3] === 'true';
const nb_per_page = 90;


export function ratio(value, min, max)
{
	if (min >= max)
		throw new Error('min must be less than max');

	const result = (value - min) / (max - min);

	return Math.max(0, Math.min(1, result));
}


function clean_id(id)
{
	let cleaned_id = id;

	if (cleaned_id.startsWith('openalex.org/'))
		return cleaned_id.replaceAll('openalex.org/', '').trim();

	if (cleaned_id.startsWith('http://openalex.org/'))
		return cleaned_id.replaceAll('http://openalex.org/', '').trim();

	if (cleaned_id.startsWith('https://openalex.org/'))
		return cleaned_id.replaceAll('https://openalex.org/', '').trim();

	if (cleaned_id.startsWith('www.openalex.org/'))
		return cleaned_id.replaceAll('www.openalex.org/', '').trim();

	if (cleaned_id.startsWith('http://www.openalex.org/'))
		return cleaned_id.replaceAll('http://www.openalex.org/', '').trim();

	if (cleaned_id.startsWith('https://www.openalex.org/'))
		return cleaned_id.replaceAll('https://www.openalex.org/', '').trim();

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
	const ids = papers
		.filter(paper => paper.id)
		.filter(paper => !only_reviews || paper.review)
		.toSorted((a, b) => b.year - a.year)
		.slice(0, nb_per_page)
		.map(paper => paper.id);

	let query = new URLSearchParams({
		'filter': 'openalex:' + ids.join('|'),
		'select': 'id,referenced_works',
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
		'select': 'id,title,doi,publication_year',
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


async function import_ignore()
{
	try
	{
		const content = await fs.promises.readFile(join(process.cwd(), 'scripts', 'ignore', `${map_id}.txt`), 'utf-8');
		return content.split('\n').map(line => line.trim()).filter(line => line.length > 0).map(clean_id);
	}

	catch
	{
		return [];
	}
}


async function main()
{
	const map = await get_map(map_id);
	const results = await api_find_paper_ids(map.papers);
	const ignore_ids = new Set([...map.papers.filter(paper => paper.id).map(paper => paper.id), ...(await import_ignore())]);
	let papers_nb = {};

	for (const result of results)
	{
		for (const id of result.referenced_works)
		{
			if (!id || id.length === 0)
				continue;

			const cleaned_id = clean_id(id);

			if (ignore_ids.has(cleaned_id))
				continue;

			if (papers_nb[cleaned_id] === undefined)
				papers_nb[cleaned_id] = 0;

			papers_nb[cleaned_id]++;
		}
	}

	const paper_ids = Object.entries(papers_nb).toSorted((a, b) => b[1] - a[1]).map(entry => entry[0]);
	const paper_results = await api_get_papers(paper_ids);
	const papers = paper_results.map(paper => ({
		id: clean_id(paper.id),
		title: paper.title,
		doi: paper.doi,
		score: papers_nb[clean_id(paper.id)] / (map.papers.filter(p => p.year >= paper.publication_year).length || 1),
		nb: papers_nb[clean_id(paper.id)],
	})).toSorted((a, b) => a.score - b.score);

	for (const paper of papers)
		console.log((Math.min(paper.score, 1) * 100).toFixed(0) + '% (' + paper.nb + ')\n' + paper.id + '\n' + paper.title + '\n' + paper.doi + '\n');

	process.exit(0);
}


await main();
