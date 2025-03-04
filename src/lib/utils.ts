export const constants = {
	DEV: import.meta.env.DEV,
	PROD: import.meta.env.PROD,
	BASE_URL: import.meta.env.DEV ? 'http://localhost:5173' : 'https://papermap.org',
	DEFAULT_TAGS: ['papermap', 'paper', 'papers', 'map', 'science', 'research', 'study', 'studies'],
};


export function ratio(value: number, min: number, max: number): number
{
	if (min >= max)
		throw new Error('min must be less than max');

	return Math.max(0, Math.min(1, (value - min) / (max - min)));
}


export function clamp(value: number, min: number, max: number): number
{
	return Math.max(min, Math.min(max, value));
}
