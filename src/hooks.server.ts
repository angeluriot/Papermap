import fs from 'fs';
import { ENV } from '$lib/utils';

export async function handle({ event, resolve })
{
	if (event.url.pathname.startsWith('/images/'))
	{
		let image_name = event.url.pathname.slice(8);

		if (image_name.includes('/'))
			image_name = image_name.slice(0, image_name.indexOf('/'));

		if (image_name.includes('?'))
			image_name = image_name.slice(0, image_name.indexOf('?'));

		const file_path = `${ENV.IMAGES_DIR}/${image_name}`;

		if (fs.existsSync(file_path))
		{
			const file_buffer = fs.readFileSync(file_path);
			return new Response(file_buffer, { headers: { 'Content-Type': 'image/jpeg' } });
		}

		return new Response('Not found', { status: 404 });
	}

	return resolve(event);
}
