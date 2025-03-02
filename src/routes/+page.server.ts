import { import_maps } from '$lib/server/data/map';
import type { PageServerLoad } from './$types';


export const prerender = true;
export const ssr = true;
export const csr = true;


export const load: PageServerLoad = async () =>
{
	return {
		maps: await import_maps()
	};
};
