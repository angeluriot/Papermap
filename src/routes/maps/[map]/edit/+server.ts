import { json } from '@sveltejs/kit';
import { constants as C } from '$lib/server/utils';
import { promises as fs } from 'fs';
import { join } from 'path';
import { create_pull_request } from '$lib/server/github';
import { Label } from '$lib/types';
import { edit_map } from './edit';
import type { PostParams, PostRequest } from './types';


export async function POST({ params, request }: { params: PostParams, request: Request }): Promise<Response>
{
	const data = await request.json() as PostRequest;
	const edited_map = await edit_map(params.map, data.edits);

	if (C.DEV)
	{
		await fs.writeFile(join(C.LIB_DIR, `server/jsons/maps/${params.map}.json`), JSON.stringify(edited_map, null, '\t') + '\n');
		return json({ pr_url: '' });
	}

	const pr_url = await create_pull_request({
		branch_name: `edit/${params.map.replace('_', '-')}`,
		file_path: `src/lib/server/jsons/maps/${params.map}.json`,
		new_content: JSON.stringify(edited_map, null, '\t') + '\n',
		commit_message: 'Test commit message',
		title: 'Test request',
		description: 'Test description' + (data.username ? ` - @${data.username}` : '') + (data.comment ? ` - ${data.comment}` : '') + (data.contact ? ` - ${data.contact}` : ''),
		label: Label.MapChange,
	});

	return json({ pr_url });
}
