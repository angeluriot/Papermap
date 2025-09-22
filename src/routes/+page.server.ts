import type { PageServerLoad } from './$types';
import { map_titles } from '$lib/server/data/map';
import { load_svgs } from '$lib/server/emojis';


export const prerender = true;
export const ssr = true;
export const csr = true;


export const load: PageServerLoad = async () =>
{
	return {
		emojis: await load_svgs(),
		maps: Object.values(map_titles).filter(map => !map.draft),
	};
};
