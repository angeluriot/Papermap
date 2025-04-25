import { map_titles } from '$lib/server/data/map';
import type { PageServerLoad } from './$types';


export const prerender = true;
export const ssr = true;
export const csr = true;


export const load: PageServerLoad = async () =>
{
	return {
		maps: Object.values(map_titles),
	};
};
