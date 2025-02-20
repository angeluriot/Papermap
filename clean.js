import { promises as fs } from 'fs';

await fs.rm('./tmp', { recursive: true, force: true });
