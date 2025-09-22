import { validate_request } from './validate';
import { error as http_error, json } from '@sveltejs/kit';
import { GitHubAPIError, InvalidDataError } from '$lib/errors';
import { get_new_map_issue, type NewMapRequest } from '$lib/github/issue';
import { create_issue } from '$lib/server/github';
import { constants as C } from '$lib/server/utils';
import { Label } from '$lib/types';
import newrelic from 'newrelic';


export async function POST({ request }: { request: Request }): Promise<Response>
{
	try
	{
		const data = await request.json() as NewMapRequest;
		validate_request(data);

		const { title, description } = get_new_map_issue(data);

		const issue_url = await create_issue(
			title,
			description,
			Label.NewMap,
		);

		return json({ issue_url });
	}

	catch (error: any)
	{
		console.error(error);

		if (C.PROD)
			newrelic.addCustomAttribute('custom_error', error.message);

		if (error instanceof InvalidDataError)
			return http_error(400, error.message);

		if (error instanceof GitHubAPIError)
			return http_error(502, 'GitHub API error');

		return http_error(500, 'Internal server error');
	}
}
