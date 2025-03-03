import { json, error as http_error } from '@sveltejs/kit';
import { create_issue } from '$lib/server/github';
import type { PostRequest } from './types';
import { validate_request } from './validate';
import { GitHubAPIError, InvalidDataError } from '$lib/errors';


export async function POST({ request }: { request: Request }): Promise<Response>
{
	try
	{
		const data = await request.json() as PostRequest;
		validate_request(data);

		const issue_url = await create_issue(
			'Update question.json',
			'Test description' + (data.username ? ` - @${data.username}` : '') + (data.comment ? ` - ${data.comment}` : '') + (data.contact ? ` - ${data.contact}` : ''),
			data.type,
		);

		return json({ issue_url });
	}

	catch (error: any)
	{
		console.error(error);

		if (error instanceof InvalidDataError)
			return http_error(400, { message: error.message });

		if (error instanceof GitHubAPIError)
			return http_error(502, { message: 'GitHub API error' });

		return http_error(500, { message: 'Internal server error' });
	}
}
