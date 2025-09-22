import type { EntryGenerator, PageServerLoad } from './$types';
import { validate_params } from './validate';
import { create_csv } from '$lib/server/data/csv';
import { import_map, map_titles } from '$lib/server/data/map';
import { create_images } from '$lib/server/display/images';
import { load_svgs } from '$lib/server/emojis';
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
		emojis: await load_svgs(),
		map,
		journals,
		maps: Object.values(map_titles).filter(map => !map.draft),
		hash: get_hash(map),
	};
};


export const entries: EntryGenerator = () =>
{
	const paths: { map: string }[] = [];

	for (const map of Object.keys(map_titles))
		if (!map_titles[map].fake)
			paths.push({ map });

	return paths;
};
