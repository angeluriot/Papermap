import { maps_structure } from '$lib/server/data/map';
import { load_svgs } from '$lib/server/emojis';
import type { PageServerLoad } from './$types';


export const prerender = true;
export const ssr = true;
export const csr = true;


export const load: PageServerLoad = async () =>
{
	return {
		emojis: await load_svgs(),
		maps_structure,
	};
};
