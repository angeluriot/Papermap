import { promises as fs } from 'node:fs';
import { join } from 'node:path';


const TMP_DIR_PATH = join(process.cwd(), 'tmp');
const LOG_FILE_PATH = join(process.cwd(), 'newrelic_agent.log');
const ENV_PATH = join(process.cwd(), '.env');
const ENV_TEMPLATE_PATH = join(process.cwd(), '.env.template');


async function exist(path)
{
	return await fs.access(path).then(() => true).catch(() => false);
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


async function delete_file_if_exist(file_path)
{
	if (await exist(file_path))
		await fs.rm(file_path, { force: true });
}


async function create_env_if_not_exist()
{
	if (!await exist(ENV_PATH))
		await fs.copyFile(ENV_TEMPLATE_PATH, ENV_PATH);
}


await create_dir_if_not_exist(TMP_DIR_PATH);
await empty_dir(TMP_DIR_PATH);
await delete_file_if_exist(LOG_FILE_PATH);
await create_env_if_not_exist();
