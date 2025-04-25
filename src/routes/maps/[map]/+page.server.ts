import type { PageServerLoad, EntryGenerator } from './$types';
import { import_map, map_titles } from '$lib/server/data/map';
import { validate_params } from './validate';
import { create_images } from '$lib/server/display/images';
import { create_csv } from '$lib/server/data/csv';
import { get_hash } from '$lib/server/utils';


export const prerender = true;
export const ssr = true;
export const csr = true;


export const load: PageServerLoad = async ({ params }: { params: { map: string } }) =>
{
	validate_params(params);
	const { map, journals } = await import_map(params.map);

	await create_images(map);
	await create_csv(map, journals);

	return {
		map,
		journals,
		maps: Object.values(map_titles),
		hash: get_hash(map),
	};
};


export const entries: EntryGenerator = () =>
{
	let paths: { map: string }[] = [];

	for (const map of Object.keys(map_titles))
		if (!map_titles[map].fake)
			paths.push({ map });

	return paths;
};
