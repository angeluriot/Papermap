import { promises as fs } from 'fs';
import { join } from 'path';
import crypto from 'crypto';


export const constants = {
	DEV: import.meta.env.DEV,
	PROD: import.meta.env.PROD,
	BASE_URL: import.meta.env.DEV ? 'http://localhost:5173' : 'https://papermap.org',
	BASE_PATH: process.cwd(),
	STATIC_DIR: join(process.cwd(), 'static'),
	LIB_DIR: join(process.cwd(), 'src/lib'),
	TMP_DIR: join(process.cwd(), 'tmp'),
	DATA_DIR: join(process.cwd(), 'data'),
	FAKE_DATA: import.meta.env['VITE_FAKE_DATA'] === 'true',
	GITHUB_APP_ID: import.meta.env['VITE_GITHUB_APP_ID'] ? parseInt(import.meta.env['VITE_GITHUB_APP_ID']) as number : undefined,
	GITHUB_PRIVATE_KEY: import.meta.env['VITE_GITHUB_PRIVATE_KEY'] as string | undefined,
	GITHUB_CLIENT_ID: import.meta.env['VITE_GITHUB_CLIENT_ID'] as string | undefined,
	GITHUB_CLIENT_SECRET: import.meta.env['VITE_GITHUB_CLIENT_SECRET'] as string | undefined,
	GITHUB_INSTALLATION_ID: import.meta.env['VITE_GITHUB_INSTALLATION_ID'] ? parseInt(import.meta.env['VITE_GITHUB_INSTALLATION_ID']) as number : undefined,
	OPENALEX_EMAIL: import.meta.env['VITE_OPENALEX_EMAIL'] as string | undefined,
	GITHUB_OWNER: 'angeluriot',
	GITHUB_REPO: 'Papermap',
	GITHUB_DEFAULT_BRANCH: 'main',
};


export function get_random_string(length: number = 16): string
{
	let result = '';

	for (let i = 0; i < length; i++)
	{
		const base = Math.random() < 0.5 ? 65 : 97;
		result += String.fromCharCode(base + Math.floor(Math.random() * 26));
	}

	return result;
}


export async function exist(dir_path: string): Promise<boolean>
{
	return await fs.access(dir_path).then(() => true).catch(() => false);
}


export function get_hash(object: any): string
{
	return crypto.createHash('sha256').update(JSON.stringify(object) + 'v2').digest('hex').slice(0, 16)
}


export function clean_text(text: string): string
{
	return text.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().trim();
}


export function clean_doi(doi: string): string
{
	let cleaned_doi = doi;

	if (cleaned_doi.toLowerCase().startsWith('doi '))
		return cleaned_doi.slice(4).trim();

	if (cleaned_doi.toLowerCase().startsWith('doi:'))
		return cleaned_doi.slice(4).trim();

	if (cleaned_doi.toLowerCase().startsWith('doi/'))
		return cleaned_doi.slice(4).trim();

	if (cleaned_doi.startsWith('doi.org/'))
		return cleaned_doi.replace('doi.org/', '').trim();

	if (cleaned_doi.startsWith('http://doi.org/'))
		return cleaned_doi.replace('http://doi.org/', '').trim();

	if (cleaned_doi.startsWith('https://doi.org/'))
		return cleaned_doi.replace('https://doi.org/', '').trim();

	if (cleaned_doi.startsWith('www.doi.org/'))
		return cleaned_doi.replace('www.doi.org/', '').trim();

	if (cleaned_doi.startsWith('http://www.doi.org/'))
		return cleaned_doi.replace('http://www.doi.org/', '').trim();

	if (cleaned_doi.startsWith('https://www.doi.org/'))
		return cleaned_doi.replace('https://www.doi.org/', '').trim();

	while (cleaned_doi.startsWith('/'))
		cleaned_doi = cleaned_doi.substring(1).trim();

	while (cleaned_doi.endsWith('/'))
		cleaned_doi = cleaned_doi.substring(0, cleaned_doi.length - 1).trim();

	return cleaned_doi;
}
