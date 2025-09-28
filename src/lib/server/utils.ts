import { GITHUB_APP_ID, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_INSTALLATION_ID, GITHUB_PRIVATE_KEY, OPENALEX_EMAIL } from '$env/static/private';
import crypto from 'node:crypto';
import { promises as fs } from 'node:fs';
import { join } from 'node:path';


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
	GITHUB_APP_ID: GITHUB_APP_ID ? parseInt(GITHUB_APP_ID) as number : undefined,
	GITHUB_PRIVATE_KEY: GITHUB_PRIVATE_KEY as string | undefined,
	GITHUB_CLIENT_ID: GITHUB_CLIENT_ID as string | undefined,
	GITHUB_CLIENT_SECRET: GITHUB_CLIENT_SECRET as string | undefined,
	GITHUB_INSTALLATION_ID: GITHUB_INSTALLATION_ID ? parseInt(GITHUB_INSTALLATION_ID) as number : undefined,
	OPENALEX_EMAIL: OPENALEX_EMAIL || '',
	GITHUB_OWNER: 'angeluriot',
	GITHUB_REPO: 'Papermap',
	GITHUB_DEFAULT_BRANCH: 'main',
};


export function github_enabled()
{
	return Boolean(
		constants.GITHUB_APP_ID && constants.GITHUB_APP_ID !== 1 &&
		constants.GITHUB_PRIVATE_KEY && constants.GITHUB_PRIVATE_KEY !== 'your-private-key' &&
		constants.GITHUB_CLIENT_ID && constants.GITHUB_CLIENT_ID !== 'your-client-id' &&
		constants.GITHUB_CLIENT_SECRET && constants.GITHUB_CLIENT_SECRET !== 'your-client-secret' &&
		constants.GITHUB_INSTALLATION_ID && constants.GITHUB_INSTALLATION_ID !== 1,
	);
}


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
	return crypto.createHash('sha256').update(JSON.stringify(object) + 'v2').digest('hex').slice(0, 16);
}


export function clean_text(text: string): string
{
	return text.replaceAll(/[^\dA-Za-z]/g, '').toLowerCase().trim();
}


export function clean_doi(doi: string): string
{
	let cleaned_doi = doi.toLowerCase().trim();

	if (cleaned_doi.startsWith('doi '))
		return cleaned_doi.slice(4).trim();

	if (cleaned_doi.startsWith('doi:'))
		return cleaned_doi.slice(4).trim();

	if (cleaned_doi.startsWith('doi/'))
		return cleaned_doi.slice(4).trim();

	if (cleaned_doi.startsWith('doi.org/'))
		return cleaned_doi.replaceAll('doi.org/', '').trim();

	if (cleaned_doi.startsWith('http://doi.org/'))
		return cleaned_doi.replaceAll('http://doi.org/', '').trim();

	if (cleaned_doi.startsWith('https://doi.org/'))
		return cleaned_doi.replaceAll('https://doi.org/', '').trim();

	if (cleaned_doi.startsWith('www.doi.org/'))
		return cleaned_doi.replaceAll('www.doi.org/', '').trim();

	if (cleaned_doi.startsWith('http://www.doi.org/'))
		return cleaned_doi.replaceAll('http://www.doi.org/', '').trim();

	if (cleaned_doi.startsWith('https://www.doi.org/'))
		return cleaned_doi.replaceAll('https://www.doi.org/', '').trim();

	while (cleaned_doi.startsWith('/'))
		cleaned_doi = cleaned_doi.slice(1).trim();

	while (cleaned_doi.endsWith('/'))
		cleaned_doi = cleaned_doi.slice(0, Math.max(0, cleaned_doi.length - 1)).trim();

	return cleaned_doi;
}
