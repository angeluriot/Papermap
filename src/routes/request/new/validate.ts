import { z } from 'zod';
import { InvalidDataError } from '$lib/errors';
import type { NewMapRequest } from '$lib/github/issue';


const request_schema = z.object({
	title: z.string(),
	description: z.string().optional(),
	papers: z.string().optional(),
	comment: z.string().optional(),
	discord_username: z.string().optional(),
}).strict();


export function validate_request(request: NewMapRequest): void
{
	const result = request_schema.safeParse(request);

	if (!result.success)
		throw new InvalidDataError(result.error.errors[0].message);
}
