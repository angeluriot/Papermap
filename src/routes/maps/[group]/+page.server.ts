import type { PageServerLoad } from './$types';
import { import_maps } from '$lib/server/data/map';
import { redirect } from '@sveltejs/kit';

export const prerender = false;
export const ssr = true;
export const csr = true;

export const load: PageServerLoad = async ({ params }: { params: { group: string } }) =>
{
	if (params.group !== 'random')
		throw new Error('Invalid group');

	const maps = await import_maps();
	const url = maps[Math.floor(Math.random() * maps.length)].url;
	throw redirect(302, url);
};

