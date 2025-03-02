import { z } from 'zod';
import { InvalidDataError } from '$lib/server/errors';
import { paper_schema } from '$lib/server/data/validate';


export function validate_request(request: any, nb_papers: number): void
{
	const request_schema = z.object({
		username: z.string().optional(),
		contact: z.string().optional(),
		comment: z.string().optional(),
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

	let invalid_i = false;

	for (const i in request.edits.edited)
		if (parseInt(i) < 0 || parseInt(i) >= nb_papers)
		{
			invalid_i = true;
			break;
		}

	if (invalid_i)
		throw new InvalidDataError('Invalid paper index');
}
