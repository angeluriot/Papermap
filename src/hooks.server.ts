import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { constants as C } from '$lib/server/utils';
import newrelic from 'newrelic';


export const handle: Handle = async ({ event, resolve }) =>
{
	const response = await resolve(event);

	if (response.status !== 404)
		return response;

	const { url, request } = event;
	const path = url.pathname;

	if (
		request.method !== 'GET' || path === '/' || path === '' ||
		path.startsWith('/_app') || path.startsWith('/assets') || path.startsWith('/fonts') || path.startsWith('/images')
	)
		return response;

	const accept = request.headers.get('accept') || '';
	const is_html_accept = accept.includes('text/html');
	const is_data_request = request.headers.has('x-sveltekit-load');

	if (!is_html_accept || is_data_request)
		return response;

	if (C.PROD)
		newrelic.addCustomAttribute('custom_status', 404);

	throw redirect(307, '/');
};
