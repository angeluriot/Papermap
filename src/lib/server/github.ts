import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';
import { ENV } from './utils';
import { MissingEnvError, GitHubAPIError } from './errors';


export function init_client(): Octokit
{
	if (!ENV.GITHUB_APP_ID || !ENV.GITHUB_PRIVATE_KEY || !ENV.GITHUB_CLIENT_ID || !ENV.GITHUB_CLIENT_SECRET || !ENV.GITHUB_INSTALLATION_ID)
		throw new MissingEnvError('Missing GitHub environment variables');

	try
	{
		return new Octokit({
			authStrategy: createAppAuth,
			auth: {
				appId: ENV.GITHUB_APP_ID,
				privateKey: ENV.GITHUB_PRIVATE_KEY,
				clientId: ENV.GITHUB_CLIENT_ID,
				clientSecret: ENV.GITHUB_CLIENT_SECRET,
				installationId: ENV.GITHUB_INSTALLATION_ID
			},
		});
	}

	catch (error: any)
	{
		throw new GitHubAPIError(`Error initializing GitHub client: "${error?.message}"`);
	}
}


export async function create_branch(client: Octokit, branch_name: string)
{
	if (!ENV.GITHUB_OWNER || !ENV.GITHUB_REPO || !ENV.GITHUB_DEFAULT_BRANCH)
		throw new MissingEnvError('Missing GitHub environment variables');

	const { data: branch_data } = await client.rest.repos.getBranch({
		owner: ENV.GITHUB_OWNER,
		repo: ENV.GITHUB_REPO,
		branch: ENV.GITHUB_DEFAULT_BRANCH,
	});

	try
	{
		await client.rest.git.createRef({
			owner: ENV.GITHUB_OWNER,
			repo: ENV.GITHUB_REPO,
			ref: `refs/heads/${branch_name}`,
			sha: branch_data.commit.sha,
		});
	}

	catch (error: any)
	{
		throw new GitHubAPIError(`Error creating branch: "${error?.message}"`);
	}
}


export async function delete_branch(client: Octokit, branch_name: string)
{
	if (!ENV.GITHUB_OWNER || !ENV.GITHUB_REPO)
		throw new MissingEnvError('Missing GitHub environment variables');

	try
	{
		await client.rest.git.deleteRef({
			owner: ENV.GITHUB_OWNER,
			repo: ENV.GITHUB_REPO,
			ref: `heads/${branch_name}`,
		});
	}

	catch (error: any)
	{
		throw new GitHubAPIError(`Error deleting branch: "${error?.message}"`);
	}
}


export async function update_file(client: Octokit, branch: string, file_path: string, new_content: string, commit_message: string)
{
	if (!ENV.GITHUB_OWNER || !ENV.GITHUB_REPO)
		throw new MissingEnvError('Missing GitHub environment variables');

	let file_content: string;
	let file_sha: string;

	try
	{
		const { data: file_data } = await client.rest.repos.getContent({
			owner: ENV.GITHUB_OWNER,
			repo: ENV.GITHUB_REPO,
			path: file_path,
			ref: branch,
		});

		if (!('content' in file_data) || !file_data.content)
			throw new Error('File content not found');

		file_sha = file_data.sha;
		file_content = Buffer.from(file_data.content, 'base64').toString('utf-8');
	}

	catch (error: any)
	{
		throw new GitHubAPIError(`Error accessing file: "${error?.message}"`);
	}

	if (file_content === new_content)
		throw new GitHubAPIError('File content is already up to date');

	try
	{
		await client.rest.repos.createOrUpdateFileContents({
			owner: ENV.GITHUB_OWNER,
			repo: ENV.GITHUB_REPO,
			path: file_path,
			message: commit_message,
			content: Buffer.from(new_content).toString("base64"),
			sha: file_sha,
			branch: branch,
		});
	}

	catch (error: any)
	{
		throw new GitHubAPIError(`Error updating file: "${error?.message}"`);
	}
}


export async function create_pull_request(client: Octokit, branch: string, title: string, description: string): Promise<string>
{
	if (!ENV.GITHUB_OWNER || !ENV.GITHUB_REPO || !ENV.GITHUB_DEFAULT_BRANCH)
		throw new MissingEnvError('Missing GitHub environment variables');

	try
	{
		const { data: pull_request } = await client.rest.pulls.create({
			owner: ENV.GITHUB_OWNER,
			repo: ENV.GITHUB_REPO,
			title: title,
			head: branch,
			base: ENV.GITHUB_DEFAULT_BRANCH,
			body: description,
		});

		return pull_request.html_url;
	}

	catch (error: any)
	{
		throw new GitHubAPIError(`Error creating pull request: "${error?.message}"`);
	}
}
