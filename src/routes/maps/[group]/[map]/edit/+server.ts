import { json, error as http_error } from '@sveltejs/kit';
import { constants as C } from '$lib/server/utils';
import { promises as fs } from 'fs';
import { join } from 'path';
import { create_pull_request } from '$lib/server/github';
import { Label } from '$lib/types';
import { edit_map } from './edit';
import type { Params } from '../types';
import type { PostRequest } from './types';
import { GitHubAPIError, InvalidDataError, NotFoundError } from '$lib/errors';
import { import_datamap } from '$lib/server/data/map';
import { validate_params } from '../validate';
import { validate_request } from './validate';


export async function POST({ params, request }: { params: Params, request: Request }): Promise<Response>
{
	try
	{
		validate_params(params);

		const data = await request.json() as PostRequest;
		const map = await import_datamap(params.group, params.map);

		validate_request(data, map.papers.length);

		const edited_map = await edit_map(params.group, params.map, data.edits);

		if (C.DEV)
		{
			await fs.writeFile(join(C.LIB_DIR, `server/jsons/maps/${params.group}/${params.map}.json`), JSON.stringify(edited_map, null, '\t') + '\n');
			return json({ pr_url: '' });
		}

		const pr_url = await create_pull_request({
			branch_name: `edit/${params.group.replace('_', '-')}/${params.map.replace('_', '-')}`,
			file_path: `src/lib/server/jsons/maps/${params.group}/${params.map}.json`,
			new_content: JSON.stringify(edited_map, null, '\t') + '\n',
			commit_message: 'Test commit message',
			title: 'Test request',
			description: 'Test description' + (data.username ? ` - @${data.username}` : '') + (data.comment ? ` - ${data.comment}` : '') + (data.contact ? ` - ${data.contact}` : ''),
			label: Label.MapChange,
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
