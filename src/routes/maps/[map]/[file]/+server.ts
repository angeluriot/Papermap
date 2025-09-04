import { error as http_error } from '@sveltejs/kit';
import { constants as C } from '$lib/server/utils';
import { promises as fs } from 'fs';
import { join } from 'path';
import type { Params } from './types';
import { InvalidDataError, NotFoundError } from '$lib/errors';
import { validate_params } from './validate';
import newrelic from 'newrelic';


const EXT_TO_TYPE: { [key: string]: string } = {
	'jpg': 'image/jpeg',
	'webp': 'image/webp',
	'png': 'image/png',
	'svg': 'image/svg+xml',
	'csv': 'text/csv'
};


export async function GET({ params }: { params: Params }): Promise<Response>
{
	try
	{
		validate_params(params);

		const file_ext = params.file.split('.')[1];
		const file_type = EXT_TO_TYPE[file_ext];
		const file_path = join(C.TMP_DIR, params.map, params.file);

		if (await fs.access(file_path).then(() => false).catch(() => true))
			throw new NotFoundError('File not found');

		const file_buffer = await fs.readFile(file_path);
		return new Response(file_buffer, { headers: { 'Content-Type': `${file_type}` } });
	}

	catch (error: any)
	{
		console.error(error);

		if (C.PROD)
			newrelic.addCustomAttribute('custom_error', error.message);

		if (error instanceof InvalidDataError)
			return http_error(400, error.message);

		if (error instanceof NotFoundError)
			return http_error(404, error.message);

		return http_error(500, 'Internal server error');
	}
}
