import { score_answers, score_paper } from '$lib/server/data/score';
import { InvalidInternalDataError, NotFoundError } from '$lib/errors';
import type { Journal } from '$lib/types/journal';
import type { DataMap, Group, Map, Maps } from '$lib/types/map';
import { type DataPaper } from '$lib/types/paper';
import { constants as C } from '$lib/server/utils';
import { import_journals } from './journal';
import { validate_map } from './validate';
import { generate_paper } from './fake';


export const map_files = import.meta.glob('/src/lib/server/jsons/maps/**/*.json');


export async function import_group(group: string): Promise<Group>
{
	const file_path = `/src/lib/server/jsons/maps/${group}/_init_.json`;

	if (!map_files[file_path])
		throw new NotFoundError(`Group not found: ${group}`);

	const data = structuredClone((await map_files[file_path]() as any).default);

	return { id: group, ...data };
}


export async function import_datamap(group: string, id: string): Promise<DataMap>
{
	const file_path = `/src/lib/server/jsons/maps/${group}/${id}.json`;

	if (id.startsWith('_') || !map_files[file_path])
		throw new NotFoundError(`Map not found: ${group}/${id}`);

	const map = structuredClone((await map_files[file_path]() as any).default);

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
	const group_data = await import_group(group);
	const data = await import_datamap(group, id);
	const all_journals = await import_journals();

	for (let i = 0; i < 50; i++)
		data.papers.push(generate_paper(data, all_journals));

	const journals = await import_journals(data);

	let map: Map = {
		...data,
		group: group_data,
		id,
		papers: data.papers.map((paper: DataPaper) => score_paper(data, paper.journal.id ? journals[paper.journal.id] : undefined, paper)),
		overview: {}
	};

	map.overview = score_answers(map);

	return { map, journals };
}


export async function import_maps(): Promise<Maps>
{
	let maps: Maps = {};

	for (const path of Object.keys(map_files))
	{
		const match = path.match('/src/lib/server/jsons/maps/(.+)/(.+).json');

		if (!match || match[2].startsWith('_'))
			continue;

		const group = match[1];
		const map = match[2];
		const group_data = await import_group(group);
		const map_data = (await import_datamap(group, map));
		const url = `${C.BASE_URL}/maps/${group}/${map}`;

		if (!maps[group])
			maps[group] = { emoji: group_data.emoji, name: group_data.name, maps: [] };

		maps[group].maps.push({ emoji: map_data.emoji, name: map_data.question.long, url });
	}

	return maps;
}
