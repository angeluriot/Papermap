import { sleep } from '$lib/server/utils';
import { semantic_scholar_search, type SemanticScholarPaper } from './api';


const NB_RETRIES = 3;
const RETRY_DELAY = 2.75;

export interface SearchPaperResult
{
	id?: string;
	title?: string;
	authors?: string[];
	journal_id?: string;
	year?: number;
	link?: string;
	citations?: number;
}


export async function search_paper(title: string): Promise<SearchPaperResult | null>
{
	let paper_results: SemanticScholarPaper[] | null = null;

	for (let i = 0; i < NB_RETRIES; i++)
	{
		try
		{
			paper_results = await semantic_scholar_search(title);
		}

		catch (error: any)
		{
			if (i == NB_RETRIES - 1)
				throw error;

			await sleep(RETRY_DELAY);
		}
	}

	return null;
}
