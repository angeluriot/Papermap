import { promises as fs } from 'fs';
import { join } from 'path';

for (const dir of ['./tmp', './tmp/images', './tmp/locks'])
	try { await fs.access(dir); } catch { await fs.mkdir(dir, { recursive: true }); }

for (const dir of ['./tmp/images', './tmp/locks'])
{
	const entries = await fs.readdir(dir);

	await Promise.all(entries.map(entry => {
		const entryPath = join(dir, entry);
		return fs.rm(entryPath, { recursive: true, force: true });
	}));
}
