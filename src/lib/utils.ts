export const BASE_URL = import.meta.env.DEV ? 'http://localhost:5173' : 'https://my-app.com';

export function get_random_string()
{
	let result = '';

	for (let i = 0; i < 16; i++)
	{
		const base = Math.random() < 0.5 ? 65 : 97;
		result += String.fromCharCode(base + Math.floor(Math.random() * 26));
	}

	return result;
}
