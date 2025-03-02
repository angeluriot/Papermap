import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';
import { constants as C } from '../utils';
import { MissingEnvError, GitHubAPIError } from '../errors';


export function init_client(): Octokit
{
	if (!C.GITHUB_APP_ID || !C.GITHUB_PRIVATE_KEY || !C.GITHUB_CLIENT_ID || !C.GITHUB_CLIENT_SECRET || !C.GITHUB_INSTALLATION_ID)
		throw new MissingEnvError('Missing GitHub environment variables');

	try
	{
		return new Octokit({
			authStrategy: createAppAuth,
			auth: {
				appId: C.GITHUB_APP_ID,
				privateKey: C.GITHUB_PRIVATE_KEY,
				clientId: C.GITHUB_CLIENT_ID,
				clientSecret: C.GITHUB_CLIENT_SECRET,
				installationId: C.GITHUB_INSTALLATION_ID,
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
	const { data: branch_data } = await client.rest.repos.getBranch({
		owner: C.GITHUB_OWNER,
		repo: C.GITHUB_REPO,
		branch: C.GITHUB_DEFAULT_BRANCH,
	});

	try
	{
		await client.rest.git.createRef({
			owner: C.GITHUB_OWNER,
			repo: C.GITHUB_REPO,
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
	try
	{
		await client.rest.git.deleteRef({
			owner: C.GITHUB_OWNER,
			repo: C.GITHUB_REPO,
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
	let file_content: string;
	let file_sha: string;

	try
	{
		const { data: file_data } = await client.rest.repos.getContent({
			owner: C.GITHUB_OWNER,
			repo: C.GITHUB_REPO,
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
			owner: C.GITHUB_OWNER,
			repo: C.GITHUB_REPO,
			path: file_path,
			message: commit_message,
			content: Buffer.from(new_content).toString('base64'),
			sha: file_sha,
			branch: branch,
		});
	}

	catch (error: any)
	{
		throw new GitHubAPIError(`Error updating file: "${error?.message}"`);
	}
}


export async function set_label(client: Octokit, number: number, label: string)
{
	try
	{
		await client.rest.issues.addLabels({
			owner: C.GITHUB_OWNER,
			repo: C.GITHUB_REPO,
			issue_number: number,
			labels: [label],
		});
	}

	catch (error: any)
	{
		throw new GitHubAPIError(`Error setting label: "${error?.message}"`);
	}
}


export async function create_pull_request(client: Octokit, branch: string, title: string, description: string, label: string): Promise<string>
{
	let pr_url: string;
	let pr_number: number;

	try
	{
		const { data: pull_request } = await client.rest.pulls.create({
			owner: C.GITHUB_OWNER,
			repo: C.GITHUB_REPO,
			title: title,
			head: branch,
			base: C.GITHUB_DEFAULT_BRANCH,
			body: description,
		});

		pr_url = pull_request.html_url;
		pr_number = pull_request.number;
	}

	catch (error: any)
	{
		throw new GitHubAPIError(`Error creating pull request: "${error?.message}"`);
	}

	await set_label(client, pr_number, label);
	return pr_url;
}


export async function create_issue(client: Octokit, title: string, description: string, label: string): Promise<string>
{
	let issue_url: string;
	let issue_number: number;

	try
	{
		const { data: issue } = await client.rest.issues.create({
			owner: C.GITHUB_OWNER,
			repo: C.GITHUB_REPO,
			title: title,
			body: description,
		});

		issue_url = issue.html_url;
		issue_number = issue.number;
	}

	catch (error: any)
	{
		throw new GitHubAPIError(`Error creating issue: "${error?.message}"`);
	}

	await set_label(client, issue_number, label);
	return issue_url;
}
