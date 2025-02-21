import { promises as fs } from 'fs';
import { DEPLOY_LOCK } from './utils.js';


await fs.rm(DEPLOY_LOCK, { force: true });
