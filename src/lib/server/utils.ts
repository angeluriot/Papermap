import { promises as fs } from 'fs';
import { join } from 'path';


export const constants = {
	DEV: import.meta.env.DEV,
	PROD: import.meta.env.PROD,
	BASE_URL: import.meta.env.DEV ? 'http://localhost:5173' : 'https://papermap.org',
	BASE_PATH: process.cwd(),
	STATIC_DIR: join(process.cwd(), 'static'),
	LIB_DIR: join(process.cwd(), 'src/lib'),
	IMAGES_DIR: join(process.cwd(), 'tmp/images'),
	GITHUB_APP_ID: import.meta.env['VITE_GITHUB_APP_ID'] ? parseInt(import.meta.env['VITE_GITHUB_APP_ID']) as number : undefined,
	GITHUB_PRIVATE_KEY: import.meta.env['VITE_GITHUB_PRIVATE_KEY'] as string | undefined,
	GITHUB_CLIENT_ID: import.meta.env['VITE_GITHUB_CLIENT_ID'] as string | undefined,
	GITHUB_CLIENT_SECRET: import.meta.env['VITE_GITHUB_CLIENT_SECRET'] as string | undefined,
	GITHUB_INSTALLATION_ID: import.meta.env['VITE_GITHUB_INSTALLATION_ID'] ? parseInt(import.meta.env['VITE_GITHUB_INSTALLATION_ID']) as number : undefined,
	GITHUB_OWNER: 'angeluriot',
	GITHUB_REPO: 'Papermap',
	GITHUB_DEFAULT_BRANCH: 'main',
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


export function sleep(seconds: number): Promise<void>
{
	return new Promise(resolve => setTimeout(resolve, Math.round(seconds * 1000)));
}


export async function exist(dir_path: string): Promise<boolean>
{
	return await fs.access(dir_path).then(() => true).catch(() => false);
}


export function ratio(value: number, min: number, max: number): number
{
	if (min >= max)
		throw new Error('min must be less than max');

	return Math.max(0, Math.min(1, (value - min) / (max - min)));
}
