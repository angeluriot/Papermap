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
