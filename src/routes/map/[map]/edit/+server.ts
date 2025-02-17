import { json } from '@sveltejs/kit';
import { get_random_string } from '$lib/utils';
import { promises as fs } from 'fs';

const tmp_dir = import.meta.env.DEV ? './tmp' : '/papermap-tmp';

export async function POST({ params, request }) {
	const data = await request.json();

	console.log('Data:', data);
	console.log('Used path:', params.map);

	await fs.mkdir(tmp_dir, { recursive: true });
	await fs.writeFile(`${tmp_dir}/${get_random_string()}.lock`, '');

	return json({ status: 200 });
}
