import { promises as fs } from 'fs';
import { create_dir_if_not_exist, empty_dir, exist, sleep, TMP_DIR, LOCKS_DIR, IMAGES_DIR, DEPLOY_LOCK } from './utils.js';


const FORCE = process.argv.slice(2).includes('--force');
const KEEP_LOCK = process.argv.slice(2).includes('--keep-lock');
export const NB_TRIES = 5;
export const TIME_BETWEEN_TRIES = 3;


async function no_lock()
{
	const entries = await fs.readdir(LOCKS_DIR);
	return entries.length === 0 || (entries.length === 1 && entries[0] === 'deploy.lock')
}


await create_dir_if_not_exist(TMP_DIR);
await create_dir_if_not_exist(IMAGES_DIR);
await create_dir_if_not_exist(LOCKS_DIR);

await empty_dir(IMAGES_DIR);

if (!KEEP_LOCK && await exist(DEPLOY_LOCK))
	await fs.rm(DEPLOY_LOCK, { force: true });

if (FORCE)
	await empty_dir(LOCKS_DIR);
else
{
	for (let i = 0; i < NB_TRIES; i++)
	{
		if (await no_lock())
			process.exit(0);

		if (i < NB_TRIES - 1)
		{
			console.warn(`Waiting for ${LOCKS_DIR} to be empty...`);
			await sleep(TIME_BETWEEN_TRIES * 1000);
		}
	}

	console.error(`Directory ${LOCKS_DIR} is not empty.`);
	process.exit(1);
}
