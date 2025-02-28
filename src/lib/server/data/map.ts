import { score_paper } from '$lib/server/data/score';
import { NotFoundError } from '$lib/server/errors';
import type { Journal } from '$lib/types/journal';
import type { DataMap, Map } from '$lib/types/map';
import type { DataPaper } from '$lib/types/paper';
import { join } from 'path';
import { promises as fs } from 'fs';
import { constants as C } from '$lib/server/utils';


export const map_files = import.meta.glob('/src/lib/server/jsons/maps/*.json');


export async function import_journals(map: DataMap | undefined = undefined): Promise<{ [id: string]: Journal }>
{
	const journals = JSON.parse(await fs.readFile(join(C.LIB_DIR, 'server/jsons/journals/data.json'), 'utf-8')) as { [id: string]: Journal };

	if (!map)
		return journals;

	let used_journals: { [id: string]: Journal } = {};

	for (let paper of map.papers)
		if (paper.journal.id)
			used_journals[paper.journal.id] = journals[paper.journal.id];

	return used_journals;
}


export async function import_datamap(id: string): Promise<DataMap>
{
	const file_path = `/src/lib/server/jsons/maps/${id}.json`;

	if (!map_files[file_path])
		throw new NotFoundError(`Map not found: ${id}`);

	return (await map_files[file_path]() as any).default;
}


export async function import_map(id: string): Promise<{ map: Map, journals: { [id: string]: Journal } }>
{
	const data = await import_datamap(id);
	const journals = await import_journals(data);

	return {
		map: {
			...data,
			id,
			papers: data.papers.map((paper: DataPaper) => score_paper(data, paper.journal.id ? journals[paper.journal.id] : undefined, paper))
		},
		journals
	};
}
