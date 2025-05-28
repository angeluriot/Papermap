import { score_map } from '$lib/scoring/map';
import { InvalidInternalDataError, NotFoundError } from '$lib/errors';
import type { Journal } from '$lib/types/journal';
import type { DataMap, Group, Map, MapTitle } from '$lib/types/map';
import { type DataPaper } from '$lib/types/paper';
import { get_journal_ids, get_journals } from './journal';
import { validate_map } from './validate';
import { generate_group, generate_map_title, generate_paper } from './fake';
import { get_hash } from '../utils';
import cloneDeep from 'clone-deep';


const map_files = import.meta.glob('/src/lib/server/jsons/maps/**/*.json');


async function import_group(group: string): Promise<Group>
{
	const file_path = `/src/lib/server/jsons/maps/${group}/_init_.json`;

	if (!map_files[file_path])
		throw new NotFoundError(`Group not found: ${group}`);

	const data = cloneDeep((await map_files[file_path]() as any).default);

	return { id: group, ...data };
}


async function _import_datamap(group: string, id: string): Promise<DataMap>
{
	const file_path = `/src/lib/server/jsons/maps/${group}/${id}.json`;

	if (id.startsWith('_') || !map_files[file_path])
		throw new NotFoundError(`Map not found: ${id}`);

	const map = cloneDeep((await map_files[file_path]() as any).default);

	try
	{
		validate_map(map);
	}

	catch (error: any)
	{
		throw new InvalidInternalDataError(`Invalid map ${id}: ${error?.message}`);
	}

	return map;
}


async function import_map_titles(): Promise<MapTitle[]>
{
	let maps: MapTitle[] = [];

	for (const path of Object.keys(map_files))
	{
		const match = path.match('/src/lib/server/jsons/maps/(.+)/(.+).json');

		if (!match || match[2].startsWith('_'))
			continue;

		const group = match[1];
		const map = match[2];
		const group_data = await import_group(group);
		const map_data = await _import_datamap(group, map);

		maps.push({
			group: group_data,
			id: map,
			draft: map_data.draft,
			emoji: map_data.emoji,
			question: map_data.question,
			description: map_data.description,
			tags: map_data.tags,
			url: `/maps/${map}`,
			hash: get_hash(map_data),
		});
	}

	let groups = [];

	for (let i = 0; i < 10; i++)
		groups.push(generate_group());

	for (let i = 0; i < 50; i++)
		maps.push(generate_map_title(groups[Math.floor(Math.random() * groups.length)]));

	return maps;
}


export const map_titles = Object.fromEntries((await import_map_titles()).map(map => [map.id, map]));


export async function import_datamap(id: string): Promise<DataMap>
{
	return await _import_datamap(map_titles[id].group.id, id);
}


export async function import_map(id: string): Promise<{ map: Map, journals: { [id: string]: Journal } }>
{
	const group_data = map_titles[id].group;
	const data = await import_datamap(id);
	const journal_ids = await get_journal_ids();

	for (let i = 0; i < 50; i++)
		data.papers.push(generate_paper(data, journal_ids));

	const journals = await get_journals(
		data.papers
		.map((paper: DataPaper) => paper.journal.id)
		.filter((id: string | undefined) => id !== undefined) as string[]
	);

	let map = score_map(id, group_data, data, journals);

	return { map, journals };
}
