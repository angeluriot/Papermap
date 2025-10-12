import { validate_params } from '../validate';
import { edit_map, get_pr_texts } from './edit';
import type { PostRequest } from './types';
import { validate_request } from './validate';
import { error as http_error, json, type RequestHandler } from '@sveltejs/kit';
import { GitHubAPIError, InvalidDataError, NotFoundError } from '$lib/errors';
import { import_datamap } from '$lib/server/data/map';
import { create_pull_request } from '$lib/server/github';
import { constants as C } from '$lib/server/utils';
import { Label } from '$lib/types';
import newrelic from 'newrelic';
import { promises as fs } from 'node:fs';
import { join } from 'node:path';


export const POST: RequestHandler = async ({ url, params, request }) =>
{
	try
	{
		validate_params(params as any);

		const local = url.searchParams.get('local') !== null;

		if (local && !C.DEV)
			throw new InvalidDataError('Local edits are not allowed in production');

		const data = await request.json() as PostRequest;

		validate_request(data);

		const map_id = (params as any).map;
		const map = await import_datamap(map_id);
		const edited_map = await edit_map(map, data.edits);
		const { groups, id, ...content } = edited_map;

		if (local)
		{
			await fs.writeFile(
				join(C.DATA_DIR, 'maps', ...map.groups.map(group => group.id), `${map.id}.json`),
				JSON.stringify(content, null, '\t') + '\n',
			);
			return json({});
		}

		const { title, description } = get_pr_texts(map, map_id, data.comment, data.discord_username, data.edits);

		const pr_url = await create_pull_request({
			branch_name: `edit/${map_id.replaceAll('_', '-')}`,
			file_path: `data/maps/${map.groups.map(group => group.id).join('/')}/${map.id}.json`,
			new_content: JSON.stringify(content, null, '\t') + '\n',
			commit_message: title,
			title,
			description,
			label: Label.MapUpdate,
		});

		return json({ pr_url });
	}

	catch (error: any)
	{
		console.error(error);

		if (C.PROD)
			newrelic.addCustomAttribute('custom_error', error.message);

		if (error instanceof InvalidDataError)
			return http_error(400, error.message);

		if (error instanceof NotFoundError)
			return http_error(404, error.message);

		if (error instanceof GitHubAPIError)
			return http_error(502, 'GitHub API error');

		return http_error(500, 'Internal server error');
	}
};
