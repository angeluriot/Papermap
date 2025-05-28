import { z } from 'zod';
import { InvalidDataError } from '$lib/errors';
import { paper_schema } from '$lib/server/data/validate';
import type { PostRequest } from './types';


export function validate_request(request: PostRequest, nb_papers: number): void
{
	const request_schema = z.object({
		comment: z.string().optional(),
		discord_username: z.string().optional(),
		edits: z.object({
			deleted: z.array(z.number().int().gte(0).lt(nb_papers)),
			edited: z.record(
				z.string(),
				paper_schema,
			),
			added: z.array(paper_schema),
		}).strict(),
	}).strict();

	const result = request_schema.safeParse(request);

	if (!result.success)
		throw new InvalidDataError(result.error.errors[0].message);

	for (const i in request.edits.edited)
		if (parseInt(i) < 0 || parseInt(i) >= nb_papers)
			throw new InvalidDataError('Invalid paper index');
}
