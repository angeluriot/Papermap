import { promises as fs } from 'fs';
import { DEPLOY_LOCK } from './utils.js';


await fs.writeFile(DEPLOY_LOCK, '');
