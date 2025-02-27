import { json } from '@sveltejs/kit';
import { constants as C } from '$lib/server/utils';
import { promises as fs } from 'fs';
import { join } from 'path';
import { create_pull_request } from '$lib/server/github';
import { PRLabel } from '$lib/types';
import { edit_map } from '$lib/server/data/edit';


export async function POST({ params, request }: { params: { map: string }, request: Request }): Promise<Response>
{
	const data = await request.json();

	console.log('Data:', data.comment, data.edits);
	console.log('Used path:', params.map);

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
		commit_message: 'Update question.json',
		title: 'Update question.json',
		description: 'Test description - ' + data.comment,
		label: PRLabel.MapChange,
	});

	return json({ pr_url });
}
