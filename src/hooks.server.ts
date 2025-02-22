import { promises as fs } from 'fs';
import { join } from 'path';
import { constants as C } from '$lib/server/utils';


export async function handle({ event, resolve })
{
	if (event.url.pathname.startsWith('/images/'))
	{
		let image_name = event.url.pathname.slice(8);

		if (image_name.includes('/'))
			image_name = image_name.slice(0, image_name.indexOf('/'));

		if (image_name.includes('?'))
			image_name = image_name.slice(0, image_name.indexOf('?'));

		const file_path = join(C.IMAGES_DIR, image_name);

		if (await fs.access(file_path).then(() => true).catch(() => false))
		{
			const file_buffer = await fs.readFile(file_path);
			return new Response(file_buffer, { headers: { 'Content-Type': 'image/jpeg' } });
		}

		return new Response('Not found', { status: 404 });
	}

	return resolve(event);
}
