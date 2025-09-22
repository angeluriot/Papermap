import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { map_titles } from '$lib/server/data/map';


export const prerender = false;
export const ssr = true;
export const csr = true;


export const load: PageServerLoad = async () =>
{
	const maps = Object.values(map_titles).filter(map => !map.draft);
	const url = maps[Math.floor(Math.random() * maps.length)].url;
	throw redirect(302, url);
};
