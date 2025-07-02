import { clean_doi } from '$lib/server/utils';
import type { Journal } from '$lib/types/journal';
import type { SearchPaperResult } from '$lib/types/paper';
import { clean_id } from '$lib/utils';
import { get_journal } from '../data/journal';
import { clean_text } from '../utils';
import { openalex_search, type OpenAlexPaper } from './api';


async function find_journal(result: OpenAlexPaper): Promise<Journal | null>
{
	for (const location of result?.locations ?? [])
	{
		const journal_id = location?.source?.id;
		let journal = journal_id ? await get_journal(clean_id(journal_id)) : null;

		if (journal !== null)
			return journal;
	}

	return null;
}


export async function search_paper(doi?: string, title?: string, year?: number): Promise<SearchPaperResult[]>
{
	const paper_results = await openalex_search(doi, title, year);
	let results: SearchPaperResult[] = [];

	for (const paper of paper_results)
	{
		let result: SearchPaperResult = {}

		if (paper.id) result.id = clean_id(paper.id);
		if (paper.doi) result.link = paper.doi.trim();
		if (paper.title) result.title = paper.title.trim();
		if (paper.publication_year) result.year = paper.publication_year;

		const journal = await find_journal(paper)

		if (journal)
			result.journal = journal;

		const raw_authors = paper?.authorships.map(author => author?.author?.display_name ?? author?.raw_author_name);
		let authors = [];

		if (raw_authors)
			for (const author of raw_authors)
			{
				if (author)
					authors.push(author);

				if (authors.length >= 4)
					break;
			}

		if (authors.length > 0)
			result.authors = authors;

		if (paper.cited_by_count !== undefined) result.citations = paper.cited_by_count;
		if (paper.is_retracted !== undefined) result.retracted = paper.is_retracted;

		results.push(result);
	}

	let exact_matches: SearchPaperResult[] = [];

	if (results.length == 1)
		return results;

	if (doi)
		exact_matches = results.filter(paper => clean_doi(paper.link ?? '') == clean_doi(doi));

	if (exact_matches.length == 1)
		return exact_matches;

	if (exact_matches.length > 1)
		return [exact_matches.toSorted((a, b) => (b.citations ?? 0) - (a.citations ?? 0))[0]];

	if (title && year)
		exact_matches = results.filter(paper => clean_text(paper.title ?? '') == clean_text(title) && paper.year == year);

	if (exact_matches.length == 1)
		return exact_matches;

	return results;
}
