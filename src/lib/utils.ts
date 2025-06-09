import { UAParser } from 'ua-parser-js';


export function is_touch_screen(): boolean
{
	const type = (new UAParser()).getDevice().type;
	return type === 'mobile' || type === 'tablet' || type === 'wearable';
}


export const constants = {
	DEV: import.meta.env.DEV,
	PROD: import.meta.env.PROD,
	BASE_URL: import.meta.env.DEV ? 'http://localhost:5173' : 'https://papermap.org',
	DEFAULT_TAGS: ['papermap', 'paper', 'papers', 'map', 'science', 'research', 'study', 'studies', 'literature', 'questions'],
	TOUCH_SCREEN: is_touch_screen(),
};


export function clamp(value: number, min: number, max: number): number
{
	return Math.max(min, Math.min(max, value));
}


export function ratio(value: number, min: number, max: number, cut: boolean = true): number
{
	if (min >= max)
		throw new Error('min must be less than max');

	const result = (value - min) / (max - min);

	return cut ? clamp(result, 0, 1) : result;
}


export function get_random_elements<T>(array: T[], nb: number): T[]
{
	let indices = new Set<number>();
	let result: T[] = [];

	while (result.length < nb && result.length < array.length)
	{
		const i = Math.floor(Math.random() * array.length);

		if (!indices.has(i))
		{
			indices.add(i);
			result.push(array[i]);
		}
	}

	return result;
}


export function in_browser(): boolean
{
	return typeof window !== undefined;
}


export function sleep(seconds: number): Promise<void>
{
	return new Promise(resolve => setTimeout(resolve, Math.round(seconds * 1000)));
}


export function sleep_until(date: Date): Promise<void>
{
	return new Promise(resolve => setTimeout(resolve, Math.round(date.getTime() - Date.now())));
}


export function clean_id(id: string): string
{
	let cleaned_id = id;

	if (cleaned_id.startsWith('openalex.org/'))
		return cleaned_id.replace('openalex.org/', '').trim();

	if (cleaned_id.startsWith('http://openalex.org/'))
		return cleaned_id.replace('http://openalex.org/', '').trim();

	if (cleaned_id.startsWith('https://openalex.org/'))
		return cleaned_id.replace('https://openalex.org/', '').trim();

	if (cleaned_id.startsWith('www.openalex.org/'))
		return cleaned_id.replace('www.openalex.org/', '').trim();

	if (cleaned_id.startsWith('http://www.openalex.org/'))
		return cleaned_id.replace('http://www.openalex.org/', '').trim();

	if (cleaned_id.startsWith('https://www.openalex.org/'))
		return cleaned_id.replace('https://www.openalex.org/', '').trim();

	while (cleaned_id.startsWith('/'))
		cleaned_id = cleaned_id.substring(1).trim();

	while (cleaned_id.endsWith('/'))
		cleaned_id = cleaned_id.substring(0, cleaned_id.length - 1).trim();

	return cleaned_id.toUpperCase().trim();
}


export function get_uuid(): string
{
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';

	for (let i = 0; i < 16; i++)
		result += characters.charAt(Math.floor(Math.random() * characters.length));

	return result;
}


export function nb_common_elements<T>(array1: T[], array2: T[]): number
{
	return array1.filter(item => array2.includes(item)).length;
}
