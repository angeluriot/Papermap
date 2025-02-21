import { json } from '@sveltejs/kit';
import { constants as C, check_deploy_lock, lock, unlock } from '$lib/server/utils';
import { promises as fs } from 'fs';
import { join } from 'path'
import type { Octokit } from '@octokit/rest';
import { init_client, create_branch, delete_branch, update_file, create_pull_request } from '$lib/server/github';


export async function POST({ params, request })
{
	if (await check_deploy_lock())
		return json({ error: 'Deploy in progress' }, { status: 503 });

	const task_id = await lock();
	const data = await request.json();

	console.log('Data:', data);
	console.log('Used path:', params.map);

	const lock_file = join(C.LOCKS_DIR, `${task_id}.lock`);

	await fs.writeFile(lock_file, '');

	const branch = `edit/${params.map.replace('_', '-')}/id-${task_id}`;
	let client: Octokit;
	let pr_url: string;

	try
	{
		client = init_client();
		await create_branch(client, branch);
	}

	catch (error: any)
	{
		await unlock(task_id);
		throw error;
	}

	try
	{
		await update_file(client, branch, `src/lib/server/jsons/maps/${params.map}/question.json`, JSON.stringify(data, null, '\t') + '\n', 'Update question.json');
		pr_url = await create_pull_request(client, branch, 'Update question.json', 'Test description');
	}

	catch (error: any)
	{
		await delete_branch(client, branch);
		await unlock(task_id);
		throw error;
	}

	await unlock(task_id);

	return json({ pr_url });
}
