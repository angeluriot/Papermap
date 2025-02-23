import { json } from '@sveltejs/kit';
import { constants as C } from '$lib/server/utils';
import { promises as fs } from 'fs';
import { join } from 'path';
import { create_pull_request } from '$lib/server/github/actions';
import { PRLabel } from '$lib/server/types';


export async function POST({ params, request }: { params: { map: string }, request: Request }): Promise<Response>
{
	const data = await request.json();

	console.log('Data:', data);
	console.log('Used path:', params.map);

	if (false && C.DEV)
	{
		await fs.writeFile(join(C.LIB_DIR, `server/jsons/maps/${params.map}/question.json`), JSON.stringify(data, null, '\t') + '\n');
		return json({ pr_url: '' });
	}

	const pr_url = await create_pull_request({
		branch_name: `edit/${params.map.replace('_', '-')}`,
		file_path: `src/lib/server/jsons/maps/${params.map}/question.json`,
		new_content: JSON.stringify(data, null, '\t') + '\n',
		commit_message: 'Update question.json',
		title: 'Update question.json',
		description: 'Test description',
		label: PRLabel.MapChange,
	});

	return json({ pr_url });
}
