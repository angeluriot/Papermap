import type { Params } from './types';
import { InvalidDataError } from '$lib/errors';
import { z } from 'zod';


const params_schema = z.object({
	id: z.string().nonempty(),
}).strict();


export function validate_params(params: Params): void
{
	const result = params_schema.safeParse(params);

	if (!result.success)
		throw new InvalidDataError(result.error.errors[0].message);
}
