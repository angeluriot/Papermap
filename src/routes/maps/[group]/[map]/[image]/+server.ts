import { error as http_error } from '@sveltejs/kit';
import { constants as C } from '$lib/server/utils';
import { promises as fs } from 'fs';
import { join } from 'path';
import type { Params } from './types';
import { InvalidDataError, NotFoundError } from '$lib/errors';
import { validate_params } from './validate';


export async function GET({ params }: { params: Params }): Promise<Response>
{
	try
	{
		validate_params(params);

		const ext_to_type: { [key: string]: string } = { 'jpg': 'jpeg', 'png': 'png', 'svg': 'svg+xml' };
		const image_ext = params.image.split('.')[1];
		const image_type = ext_to_type[image_ext];
		const file_path = join(C.IMAGES_DIR, params.group, `${params.map}.${image_ext}`);

		if (await fs.access(file_path).then(() => false).catch(() => true))
			throw new NotFoundError('Image not found');

		const file_buffer = await fs.readFile(file_path);
		return new Response(file_buffer, { headers: { 'Content-Type': `image/${image_type}` } });
	}

	catch (error: any)
	{
		console.error(error);

		if (error instanceof InvalidDataError)
			return http_error(400, { message: error.message });

		if (error instanceof NotFoundError)
			return http_error(404, { message: error.message });

		return http_error(500, { message: 'Internal server error' });
	}
}
