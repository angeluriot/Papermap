import { json, error as http_error } from '@sveltejs/kit';
import { InvalidDataError, NotFoundError } from '$lib/errors';
import type { Params } from './types';
import { validate_params } from './validate';
import { get_journal } from '$lib/server/data/journal';
import { constants as C } from '$lib/server/utils';
import newrelic from 'newrelic';


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

		if (C.PROD)
			newrelic.addCustomAttribute('custom_error', error.message);

		if (error instanceof InvalidDataError)
			return http_error(400, error.message);

		if (error instanceof NotFoundError)
			return http_error(404, error.message);

		return http_error(500, 'Internal server error');
	}
}
