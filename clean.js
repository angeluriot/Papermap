import { promises as fs } from 'fs';

try
{
	await fs.chmod('./tmp/locks', 0o777);
}

catch (err) {}

await fs.rm('./tmp', { recursive: true, force: true });
