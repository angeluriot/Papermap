import { search_paper } from '$lib/server/search/paper';
import { json, error as http_error, type RequestHandler } from '@sveltejs/kit';
import { InvalidDataError, OpenAlexAPIError } from '$lib/errors';
import { constants as C } from '$lib/server/utils';
import newrelic from 'newrelic';


export const GET: RequestHandler = async ({ url }) =>
{
	try
	{
		let doi = url.searchParams.get('doi')?.trim();
		let title = url.searchParams.get('title')?.trim();
		const year_str = url.searchParams.get('year')?.trim();

		doi = typeof doi === 'string' && doi.length > 0 ? doi : undefined;
		title = typeof title === 'string' && title.length > 0 ? title : undefined;
		const year = typeof year_str === 'string' && year_str.length == 4 && !isNaN(parseInt(year_str)) ? parseInt(year_str) : undefined;

		if (!doi && (!title || !year))
			throw new InvalidDataError('Invalid query');

		const papers = await search_paper(doi, title, year);

		return json({ results: papers });
	}

	catch (error: any)
	{
		console.error(error);

		if (C.PROD)
			newrelic.addCustomAttribute('custom_error', error.message);

		if (error instanceof InvalidDataError)
			return http_error(400, error.message);

		if (error instanceof OpenAlexAPIError)
			return http_error(502, 'OpenAlex API error');

		return http_error(500, 'Internal server error');
	}
}
