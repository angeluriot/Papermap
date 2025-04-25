import { z } from 'zod';
import { InvalidDataError } from '$lib/errors';
import { FileType, type Params } from './types';
import { map_titles } from '$lib/server/data/map';


const params_schema = z.object({
	map: z.string(),
	file: z.nativeEnum(FileType),
}).strict();


export function validate_params(params: Params): void
{
	const result = params_schema.safeParse(params);

	if (!result.success)
		throw new InvalidDataError(result.error.errors[0].message);

	if (map_titles[params.map] === undefined)
		throw new InvalidDataError('Invalid map name');
}
