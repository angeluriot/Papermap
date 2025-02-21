import { promises as fs } from 'fs';
import { join } from 'path';


export const constants = {
	DEV: import.meta.env.DEV,
	PROD: import.meta.env.PROD,
	BASE_URL: import.meta.env.DEV ? 'http://localhost:5173' : (import.meta.env['VITE_DOMAIN'] as string ?? 'https://example.com'),
	BASE_PATH: process.cwd(),
	STATIC_DIR: join(process.cwd(), 'static'),
	LIB_DIR: join(process.cwd(), 'src/lib'),
	LOCKS_DIR: join(process.cwd(), 'tmp/locks'),
	IMAGES_DIR: join(process.cwd(), 'tmp/images'),
	GITHUB_APP_ID: import.meta.env['VITE_GITHUB_APP_ID'] ? parseInt(import.meta.env['VITE_GITHUB_APP_ID']) as number : undefined,
	GITHUB_PRIVATE_KEY: import.meta.env['VITE_GITHUB_PRIVATE_KEY'] as string | undefined,
	GITHUB_CLIENT_ID: import.meta.env['VITE_GITHUB_CLIENT_ID'] as string | undefined,
	GITHUB_CLIENT_SECRET: import.meta.env['VITE_GITHUB_CLIENT_SECRET'] as string | undefined,
	GITHUB_INSTALLATION_ID: import.meta.env['VITE_GITHUB_INSTALLATION_ID'] ? parseInt(import.meta.env['VITE_GITHUB_INSTALLATION_ID']) as number : undefined,
	GITHUB_OWNER: import.meta.env['VITE_GITHUB_OWNER'] as string | undefined,
	GITHUB_REPO: import.meta.env['VITE_GITHUB_REPO'] as string | undefined,
	GITHUB_DEFAULT_BRANCH: import.meta.env['VITE_GITHUB_DEFAULT_BRANCH'] as string | undefined,
};


export function get_random_string(length: number = 16): string
{
	let result = '';

	for (let i = 0; i < length; i++)
	{
		const base = Math.random() < 0.5 ? 65 : 97;
		result += String.fromCharCode(base + Math.floor(Math.random() * 26));
	}

	return result;
}


export function sleep(ms: number): Promise<void>
{
	return new Promise(resolve => setTimeout(resolve, ms));
}


export async function exist(dir_path: string): Promise<boolean>
{
	return await fs.access(dir_path).then(() => true).catch(() => false);
}


export async function check_deploy_lock(tries: number = 5, time_between_tries: number = 5): Promise<boolean>
{
	for (let i = 0; i < tries; i++)
	{
		if (!await exist(join(constants.LOCKS_DIR, 'deploy.lock')))
			return false;

		if (i < tries - 1)
			await sleep(time_between_tries * 1000);
	}

	return true;
}


export async function lock(): Promise<string>
{
	const task_id = get_random_string();
	await fs.writeFile(join(constants.LOCKS_DIR, `${task_id}.lock`), '');

	return task_id;
}

export async function unlock(task_id: string): Promise<void>
{
	await fs.unlink(join(constants.LOCKS_DIR, `${task_id}.lock`));
}
