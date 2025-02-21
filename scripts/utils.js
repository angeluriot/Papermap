import { promises as fs } from 'fs';
import { join } from 'path';

export const TMP_DIR = join(process.cwd(), 'tmp');
export const LOCKS_DIR = join(TMP_DIR, 'locks');
export const IMAGES_DIR = join(TMP_DIR, 'images');
export const DEPLOY_LOCK = join(LOCKS_DIR, 'deploy.lock');

export function sleep(ms)
{
	return new Promise(resolve => setTimeout(resolve, ms));
}


export async function exist(dir_path)
{
	return await fs.access(dir_path).then(() => true).catch(() => false);
}


export async function create_dir_if_not_exist(dir_path)
{
	if (!await exist(dir_path))
		await fs.mkdir(dir_path, { recursive: true });
}


export async function empty_dir(dir_path)
{
	const entries = await fs.readdir(dir_path);

	if (entries.length === 0)
		return;

	await Promise.all(entries.map(async entry => {
		const entry_path = join(dir_path, entry);
		return await fs.rm(entry_path, { recursive: true, force: true });
	}));
}
