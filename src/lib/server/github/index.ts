import * as api from './api';
import { get_random_string } from '$lib/server/utils';
import type { Label } from '$lib/types';


export async function create_pull_request(params: {
	branch_name: string,
	file_path: string,
	new_content: string,
	commit_message: string,
	title: string,
	description: string,
	label: Label,
}): Promise<string>
{
	const id = get_random_string();
	const branch = `${params.branch_name}/id-${id}`;
	const client = api.init_client();
	await api.create_branch(client, branch);

	try
	{
		await api.update_file(client, branch, params.file_path, params.new_content, params.commit_message);
		return await api.create_pull_request(client, branch, params.title, params.description, params.label);
	}

	catch (error: any)
	{
		await api.delete_branch(client, branch);
		throw error;
	}
}


export async function create_issue(title: string, description: string, label: Label): Promise<string>
{
	const client = api.init_client();
	return await api.create_issue(client, title, description, label);
}
