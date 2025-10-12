import type { PostRequest } from './types';
import { InvalidDataError } from '$lib/errors';
import { paper_schema } from '$lib/server/data/validate';
import { z } from 'zod';


export function validate_request(request: PostRequest): void
{
	const request_schema = z.object({
		comment: z.string().optional(),
		discord_username: z.string().optional(),
		edits: z.object({
			added: z.array(paper_schema),
			edited: z.record(
				z.string().nonempty(),
				paper_schema,
			),
			deleted: z.array(z.string().nonempty()),
		}).strict(),
	}).strict();

	const result = request_schema.safeParse(request);

	if (!result.success)
		throw new InvalidDataError(result.error.errors[0].message);

	for (const [uuid, paper] of Object.entries(request.edits.edited))
		if (paper.uuid !== uuid)
			throw new InvalidDataError(`Paper UUID mismatch: ${paper.uuid} !== ${uuid}`);
}
