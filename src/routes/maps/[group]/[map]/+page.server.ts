import type { PageServerLoad, EntryGenerator } from './$types';
import { import_map, import_maps, map_files } from '$lib/server/data/map';
import { validate_params } from './validate';
import { create_images } from '$lib/server/display/images';


export const prerender = true;
export const ssr = true;
export const csr = true;


export const load: PageServerLoad = async ({ params }: { params: { group: string, map: string } }) =>
{
	validate_params(params);
	const { map, journals } = await import_map(params.group, params.map);

	const image_hash = await create_images(params.group, map);

	return {
		map,
		journals,
		maps: await import_maps(),
		image_hash,
	};
};


export const entries: EntryGenerator = () =>
{
	let paths: { group: string, map: string }[] = [];

	for (const path of Object.keys(map_files))
	{
		const match = path.match('/src/lib/server/jsons/maps/(.+)/(.+).json');

		if (!match || match[2].startsWith('_'))
			continue;

		paths.push({
			group: match[1],
			map: match[2]
		});
	}

	return paths;
};
