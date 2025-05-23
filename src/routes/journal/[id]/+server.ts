import { json, error as http_error } from '@sveltejs/kit';
import { InvalidDataError, NotFoundError } from '$lib/errors';
import type { Params } from './types';
import { validate_params } from './validate';
import { get_journal } from '$lib/server/data/journal';


export async function GET({ params }: { params: Params }): Promise<Response>
{
	try
	{
		validate_params(params);

		const journal = await get_journal(params.id);

		if (!journal)
			throw new NotFoundError('Journal not found');

		return json({ journal });
	}

	catch (error: any)
	{
		console.error(error);

		if (error instanceof InvalidDataError)
			return http_error(400, error.message);

		if (error instanceof NotFoundError)
			return http_error(404, error.message);

		return http_error(500, 'Internal server error');
	}
}
