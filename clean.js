import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import { dirname, join } from 'path';

const tmp_dir_path = join(dirname(fileURLToPath(import.meta.url)), 'tmp');
await fs.rm(tmp_dir_path, { recursive: true, force: true });
