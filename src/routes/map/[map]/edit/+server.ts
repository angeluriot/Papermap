import { json } from '@sveltejs/kit';
import { ENV, get_random_string } from '$lib/server/utils';
import { promises as fs } from 'fs';
import type { Octokit } from '@octokit/rest';
import { init_client, create_branch, delete_branch, update_file, create_pull_request } from '$lib/server/github';


export async function POST({ params, request }) {
	const data = await request.json();

	console.log('Data:', data);
	console.log('Used path:', params.map);

	return json({ test: 'ok' });

	const task_id = get_random_string();
	const lock_file = `${ENV.LOCKS_DIR}/${task_id}.lock`;

	await fs.mkdir(ENV.LOCKS_DIR, { recursive: true });
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
		await fs.unlink(lock_file);
		throw error;
	}

	try
	{
		await update_file(client, branch, `src/lib/jsons/maps/${params.map}/question.json`, JSON.stringify(data, null, '\t') + '\n', 'Update question.json');
		pr_url = await create_pull_request(client, branch, 'Update question.json', 'Test description');
	}

	catch (error: any)
	{
		await delete_branch(client, branch);
		await fs.unlink(lock_file);
		throw error;
	}

	await fs.unlink(lock_file);

	return json({ pr_url });
}
