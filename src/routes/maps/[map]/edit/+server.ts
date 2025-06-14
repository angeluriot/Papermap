import { json, error as http_error, type RequestHandler } from '@sveltejs/kit';
import { constants as C } from '$lib/server/utils';
import { promises as fs } from 'fs';
import { join } from 'path';
import { create_pull_request } from '$lib/server/github';
import { Label } from '$lib/types';
import { edit_map, get_pr_texts } from './edit';
import type { PostRequest } from './types';
import { GitHubAPIError, InvalidDataError, NotFoundError } from '$lib/errors';
import { import_datamap } from '$lib/server/data/map';
import { validate_params } from '../validate';
import { validate_request } from './validate';


export const POST: RequestHandler = async ({ url, params, request }) =>
{
	try
	{
		validate_params(params as any);
		const map_id = (params as any).map

		let local = url.searchParams.get('local') !== null;

		if (local && !C.DEV)
			throw new InvalidDataError('Local edits are not allowed in production');

		const data = await request.json() as PostRequest;
		const map = await import_datamap(map_id);

		validate_request(data, map.papers.length);

		const edited_map = await edit_map(map, data.edits);

		if (local)
		{
			await fs.writeFile(join(C.DATA_DIR, 'maps', ...map.groups.map(group => group.id), `${map.id}.json`), JSON.stringify(edited_map, null, '\t') + '\n');
			return json({});
		}

		const { title, description } = get_pr_texts(map, map_id, data.comment, data.discord_username, data.edits)
		const { groups, id, ...content } = edited_map;

		const pr_url = await create_pull_request({
			branch_name: `edit/${map_id.replace('_', '-')}`,
			file_path: `data/maps/${map.groups.map(group => group.id).join('/')}/${map.id}.json`,
			new_content: JSON.stringify(content, null, '\t') + '\n',
			commit_message: title,
			title,
			description,
			label: Label.PapersUpdate,
		});

		return json({ pr_url });
	}

	catch (error: any)
	{
		console.error(error);

		if (error instanceof InvalidDataError)
			return http_error(400, error.message);

		if (error instanceof NotFoundError)
			return http_error(404, error.message);

		if (error instanceof GitHubAPIError)
			return http_error(502, 'GitHub API error');

		return http_error(500, 'Internal server error');
	}
}
