import { import_map, map_titles } from '$lib/server/data/map';
import { load_svgs } from '$lib/server/emojis';
import type { PageServerLoad } from './$types';


export const prerender = true;
export const ssr = true;
export const csr = true;


export const load: PageServerLoad = async () =>
{
	return {
		emojis: await load_svgs(),
		maps: await Promise.all(
			Object.values(map_titles)
			.filter(map => !map.draft)
			.map(async map => (await import_map(map.id)).map)
		),
	};
};
