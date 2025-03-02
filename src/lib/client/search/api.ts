import { SemanticScholarAPIError } from '$lib/client/errors';


export interface SemanticScholarPaper
{
	paperId: string;
	externalIds: {
		MAG: string,
		DOI: string,
		CorpusId: number,
		PubMed: string,
	};
	publicationVenue: {
		id: string,
		name: string,
		type: string,
		alternate_names: string[],
		issn: string,
		url: string,
		alternate_urls: string[],
	};
	title: string;
	year: number;
	citationCount: number;
	journal: {
		name: string,
		pages: string,
		volume: string,
	};
	authors: {
		authorId: string,
		name: string,
	}[];
}


export async function semantic_scholar_search(title: string): Promise<SemanticScholarPaper[]>
{
	const query_params = new URLSearchParams({
		query: title,
		fields: 'paperId,externalIds,publicationVenue,title,year,citationCount,journal,authors.name',
		limit: '2',
	});

	try
	{
		const response = await fetch(`http://api.semanticscholar.org/graph/v1/paper/search?${query_params.toString()}`);

		if (!response.ok)
			throw new SemanticScholarAPIError(`Request failed with status code ${response.status}`);

		return (await response.json()).data;
	}

	catch (error: any)
	{
		if (error instanceof SemanticScholarAPIError)
			throw error;

		throw new SemanticScholarAPIError(`Error fetching data: "${error?.message}"`);
	}
}
