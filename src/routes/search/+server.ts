import { search_paper } from '$lib/server/search/paper';
import { json, error as http_error, type RequestHandler } from '@sveltejs/kit';
import { InvalidDataError, OpenAlexAPIError } from '$lib/errors';


export const GET: RequestHandler = async ({ url }) =>
{
	try
	{
		const doi = url.searchParams.get('doi');
		const title = url.searchParams.get('title');
		const author = url.searchParams.get('year');

		if (typeof query !== 'string' || query.length === 0)
			throw new InvalidDataError('Invalid query');

		const papers = await search_paper(query);

		return json({ results: papers });
	}

	catch (error: any)
	{
		console.error(error);

		if (error instanceof InvalidDataError)
			return http_error(400, error.message);

		if (error instanceof OpenAlexAPIError)
			return http_error(502, 'OpenAlex API error');

		return http_error(500, 'Internal server error');
	}
}
