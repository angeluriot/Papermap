import { promises as fs } from 'node:fs';
import { join } from 'node:path';


const TMP_DIR_PATH = join(process.cwd(), 'tmp');


async function exist(dir_path)
{
	return await fs.access(dir_path).then(() => true).catch(() => false);
}


async function create_dir_if_not_exist(dir_path)
{
	if (!await exist(dir_path))
		await fs.mkdir(dir_path, { recursive: true });
}


async function empty_dir(dir_path)
{
	const entries = await fs.readdir(dir_path);

	if (entries.length === 0)
		return;

	await Promise.all(entries.map(async entry =>
	{
		const entry_path = join(dir_path, entry);
		return await fs.rm(entry_path, { recursive: true, force: true });
	}));
}


await create_dir_if_not_exist(TMP_DIR_PATH);
await empty_dir(TMP_DIR_PATH);
