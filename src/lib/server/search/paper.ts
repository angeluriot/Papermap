import { MultipleResultsError, NotFoundError } from '$lib/errors';
import type { SearchPaperResult } from '$lib/types/paper';
import { clean_text } from '../utils';
import { openalex_search } from './api';
import { search_journal } from './journal';


export async function search_paper(search: string): Promise<SearchPaperResult[]>
{
	const paper_results = await openalex_search(search);
	let results: SearchPaperResult[] = [];

	for (const paper of paper_results)
	{
		let result: SearchPaperResult = {}

		if (paper.id) result.id = paper.id;
		if (paper.doi) result.link = paper.doi;
		if (paper.title) result.title = paper.title;
		if (paper.publication_year) result.year = paper.publication_year;

		const journal = await search_journal(paper.primary_location?.source?.issn, paper.primary_location?.source?.display_name);

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

	let exact_matches = results.filter(paper => clean_text(paper.title ?? '') == clean_text(search));

	if (exact_matches.length > 0)
		return exact_matches;

	return results;
}
