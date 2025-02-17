import { error } from '@sveltejs/kit';
import type { PageServerLoad, EntryGenerator } from './$types';

export const prerender = true;
export const ssr = true;
export const csr = true;

const data_modules = import.meta.glob('/src/lib/jsons/maps/*/question.json');

export const load: PageServerLoad = async ({ params }) => {
	const file_path = `/src/lib/jsons/maps/${params.map}/question.json`;

	if (!data_modules[file_path])
		throw error(404, 'Not found');

	const json_data = await data_modules[file_path]() as { default: any };

	return {
		map: params.map,
		data: json_data.default
	};
};

export const entries: EntryGenerator = () => {
	let a = Object.keys(data_modules).map((path) => {
		const match = path.match('/src/lib/jsons/maps/(.+)/question.json');

		if (!match)
			throw new Error(`Invalid path: ${path}`);

		return {
			map: match[1]
		};
	});
	console.log(a);
	return a;
};
