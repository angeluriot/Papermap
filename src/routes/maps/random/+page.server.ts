import type { PageServerLoad } from './$types';
import { map_titles } from '$lib/server/data/map';
import { redirect } from '@sveltejs/kit';


export const prerender = false;
export const ssr = true;
export const csr = true;


export const load: PageServerLoad = async () =>
{
	const maps = Object.values(map_titles);
	const url = maps[Math.floor(Math.random() * maps.length)].url;
	throw redirect(302, url);
};

