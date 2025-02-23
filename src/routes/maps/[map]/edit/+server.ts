import { json } from '@sveltejs/kit';
import { constants as C, get_random_string } from '$lib/server/utils';
import { promises as fs } from 'fs';
import { join } from 'path'
import type { Octokit } from '@octokit/rest';
import { init_client, create_branch, delete_branch, update_file, create_pull_request } from '$lib/server/github/api';


export async function POST({ params, request }: { params: { map: string }, request: Request }): Promise<Response>
{
	const task_id = get_random_string();
	const data = await request.json();

	console.log('Data:', data);
	console.log('Used path:', params.map);

	let pr_url: string;

	if (C.DEV)
	{
		await fs.writeFile(join(C.LIB_DIR, `server/jsons/maps/${params.map}/question.json`), JSON.stringify(data, null, '\t') + '\n');
		pr_url = '';
	}

	else
	{
		const branch = `edit/${params.map.replace('_', '-')}/id-${task_id}`;
		let client: Octokit;

		try
		{
			client = init_client();
			await create_branch(client, branch);
		}

		catch (error: any)
		{
			throw error;
		}

		try
		{
			await update_file(client, branch, `src/lib/server/jsons/maps/${params.map}/question.json`, JSON.stringify(data, null, '\t') + '\n', 'Update question.json');
			pr_url = await create_pull_request(client, branch, 'Update question.json', 'Test description', 'map change');
		}

		catch (error: any)
		{
			await delete_branch(client, branch);
			throw error;
		}
	}

	return json({ pr_url });
}
