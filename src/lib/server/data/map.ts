import { score_paper } from '$lib/server/data/score';
import { InvalidInternalDataError, NotFoundError } from '$lib/errors';
import type { Journal } from '$lib/types/journal';
import type { DataMap, Map } from '$lib/types/map';
import type { DataPaper } from '$lib/types/paper';
import { constants as C } from '$lib/server/utils';
import { import_journals } from './journal';
import { validate_map } from './validate';


export const map_files = import.meta.glob('/src/lib/server/jsons/maps/**/*.json');


export async function import_group_title(group: string): Promise<string>
{
	const file_path = `/src/lib/server/jsons/maps/${group}/_init_.json`;

	if (!map_files[file_path])
		throw new NotFoundError(`Group not found: ${group}`);

	return (await map_files[file_path]() as any).default.title;
}


export async function import_datamap(group: string, id: string): Promise<DataMap>
{
	const file_path = `/src/lib/server/jsons/maps/${group}/${id}.json`;

	if (id.startsWith('_') || !map_files[file_path])
		throw new NotFoundError(`Map not found: ${group}/${id}`);

	const map = (await map_files[file_path]() as any).default;

	try
	{
		validate_map(map);
	}

	catch (error: any)
	{
		throw new InvalidInternalDataError(`Invalid map ${group}/${id}: ${error?.message}`);
	}

	return map;
}


export async function import_map(group: string, id: string): Promise<{ map: Map, journals: { [id: string]: Journal } }>
{
	const group_name = await import_group_title(group);
	const data = await import_datamap(group, id);
	const journals = await import_journals(data);

	return {
		map: {
			...data,
			group: { id: group, name: group_name },
			id,
			papers: data.papers.map((paper: DataPaper) => score_paper(data, paper.journal.id ? journals[paper.journal.id] : undefined, paper))
		},
		journals
	};
}


export async function import_maps(): Promise<{ [group: string]: { name: string, maps: { name: string, url: string }[] } }>
{
	let maps: { [group: string]: { name: string, maps: { name: string, url: string }[] } } = {};

	for (const path of Object.keys(map_files))
	{
		const match = path.match('/src/lib/server/jsons/maps/(.+)/(.+).json');

		if (!match || match[2].startsWith('_'))
			continue;

		const group = match[1];
		const map = match[2];
		const group_name = await import_group_title(group);
		const map_name = (await import_datamap(group, map)).question;
		const url = `${C.BASE_URL}/maps/${group}/${map}`;

		if (!maps[group])
			maps[group] = { name: group_name, maps: [] };

		maps[group].maps.push({ name: map_name, url });
	}

	return maps;
}
