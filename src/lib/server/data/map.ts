import { score_paper } from '$lib/server/data/score';
import { NotFoundError } from '$lib/server/errors';
import type { Journal } from '$lib/types/journal';
import type { DataMap, Map } from '$lib/types/map';
import type { DataPaper } from '$lib/types/paper';
import Journals from '$lib/server/jsons/journals/data.json';


const data_modules = import.meta.glob('/src/lib/server/jsons/maps/*.json');


export function import_journals(map: DataMap | undefined = undefined): { [id: string]: Journal }
{
	if (!map)
		return Journals as { [id: string]: Journal; };

	let journals: { [id: string]: Journal } = {};

	for (let paper of map.papers)
		if (paper.journal.id)
			journals[paper.journal.id] = (Journals as { [id: string]: Journal })[paper.journal.id];

	return journals;
}


export async function import_datamap(id: string): Promise<DataMap>
{
	const file_path = `/src/lib/server/jsons/maps/${id}.json`;

	if (!data_modules[file_path])
		throw new NotFoundError(`Map not found: ${id}`);

	return (await data_modules[file_path]() as any).default;
}


export async function import_map(id: string): Promise<Map>
{
	const data = await import_datamap(id);
	const journals = import_journals(data);

	return {
		...data,
		id,
		papers: data.papers.map((paper: DataPaper) => score_paper(data, paper.journal.id ? journals[paper.journal.id] : undefined, paper))
	};
}
