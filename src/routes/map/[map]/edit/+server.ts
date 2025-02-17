import { json } from '@sveltejs/kit';

export async function POST({ params, request }) {
	const data = await request.json();

	console.log('Data:', data);
	console.log('Used path:', params.map);

	return json({ status: 200 });
}
