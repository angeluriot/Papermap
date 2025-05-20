import { clean_doi } from '$lib/server/utils';
import type { SearchPaperResult } from '$lib/types/paper';
import { clean_id } from '$lib/utils';
import { get_journal } from '../data/journal';
import { clean_text } from '../utils';
import { openalex_search } from './api';


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

		const journal_id = paper.primary_location?.source?.id;
		const journal = journal_id ? await get_journal(clean_id(journal_id)) : null;

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

		if (paper.cited_by_count) result.citations = paper.cited_by_count;
		if (paper.is_retracted) result.retracted = paper.is_retracted;

		results.push(result);
	}

	let exact_matches: SearchPaperResult[] = [];

	if (results.length == 1)
		return results;

	if (doi)
		exact_matches = results.filter(paper => clean_doi(paper.link ?? '') == clean_doi(doi));

	if (exact_matches.length == 1)
		return exact_matches;

	if (title && year)
		exact_matches = results.filter(paper => clean_text(paper.title ?? '') == clean_text(title) && paper.year == year);

	if (exact_matches.length == 1)
		return exact_matches;

	return results;
}
