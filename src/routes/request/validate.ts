import { z } from 'zod';
import { InvalidDataError } from '$lib/server/errors';
import { Label } from '$lib/types';


const request_schema = z.object({
	username: z.string().optional(),
	contact: z.string().optional(),
	comment: z.string().optional(),
	type: z.nativeEnum(Label),
	group: z.string().optional(),
	map: z.string().optional(),
	journal: z.string().optional(),
}).strict();


export function validate_request(request: any): void
{
	const result = request_schema.safeParse(request);

	if (!result.success)
		throw new InvalidDataError(result.error.errors[0].message);
}
