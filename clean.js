import { promises as fs } from 'fs';
import { join } from 'path';

const TMP_DIR = join(process.cwd(), 'tmp');
const LOCKS_DIR = join(TMP_DIR, 'locks');
const IMAGES_DIR = join(TMP_DIR, 'images');

for (const dir of [TMP_DIR, IMAGES_DIR, LOCKS_DIR])
	try { await fs.access(dir); } catch { await fs.mkdir(dir, { recursive: true }); }

for (const dir of [IMAGES_DIR, LOCKS_DIR])
{
	const entries = await fs.readdir(dir);

	await Promise.all(entries.map(async entry => {
		const entry_path = join(dir, entry);
		return await fs.rm(entry_path, { recursive: true, force: true });
	}));
}
