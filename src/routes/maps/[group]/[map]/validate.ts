import { z } from 'zod';
import { InvalidDataError } from '$lib/server/errors';
import type { Params } from './types';


const params_schema = z.object({
	group: z.string(),
	map: z.string(),
}).strict();


export function validate_params(params: Params): void
{
	const result = params_schema.safeParse(params);

	if (!result.success)
		throw new InvalidDataError(result.error.errors[0].message);

	if ((params.group + params.map).includes('/') || (params.group + params.map).includes('.'))
		throw new InvalidDataError('Invalid group or map name');
}
