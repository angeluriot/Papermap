import { score_map } from '$lib/scoring/map';
import { InvalidInternalDataError, NotFoundError } from '$lib/errors';
import type { Journal } from '$lib/types/journal';
import type { DataMap, Group, GroupNode, Map, MapTitle } from '$lib/types/map';
import { type DataPaper } from '$lib/types/paper';
import { get_journal_ids, get_journals } from './journal';
import { validate_group, validate_map } from './validate';
import { generate_group_node, generate_map_title, generate_paper } from './fake';
import { get_hash } from '../utils';
import { promises as fs } from 'fs';
import { constants as C } from '$lib/server/utils';
import { join } from 'path';


function add_group(group_node: GroupNode, group: Group)
{
	for (let map of group_node.maps)
		map.groups.unshift(group);

	for (let sub_group of group_node.sub_groups)
		add_group(sub_group, group);
}


async function import_group_node(path: string): Promise<GroupNode>
{
	let group: Group | undefined = undefined;
	let maps: MapTitle[] = [];
	let sub_groups: GroupNode[] = [];

	const files = await fs.readdir(path, { withFileTypes: true });

	for (const file of files)
	{
		if (file.isDirectory())
			sub_groups.push(await import_group_node(`${path}/${file.name}`));

		else if (file.name === '_init_.json')
		{
			group = {
				id: path.split('/')[path.split('/').length - 1],
				...JSON.parse(await fs.readFile(`${path}/${file.name}`, 'utf-8'))
			};
		}

		else if (file.name.endsWith('.json') && !file.name.startsWith('_'))
		{
			const id = file.name.replace('.json', '');

			const map: DataMap = {
				groups: [],
				id,
				...JSON.parse(await fs.readFile(`${path}/${file.name}`, 'utf-8')),
			};

			validate_map(map);

			maps.push({
				groups: map.groups,
				id: map.id,
				draft: map.draft,
				emoji: map.emoji,
				question: map.question,
				description: map.description,
				tags: map.tags,
				url: `/maps/${map.id}`,
				hash: get_hash(map),
			});
		}
	}

	if (!group)
		throw new InvalidInternalDataError(`Group not found in path: ${path}`);

	validate_group(group);

	for (let i = 0; i < Math.floor(Math.random() * 5); i++)
		maps.push(generate_map_title());

	while (Math.random() < 0.5)
		sub_groups.push(generate_group_node());

	let group_node: GroupNode = {
		...group,
		maps: maps.toSorted((a, b) => a.question.short.localeCompare(b.question.short)),
		sub_groups: sub_groups.toSorted((a, b) => a.name.localeCompare(b.name)),
	};

	add_group(group_node, group);

	return group_node;
}


async function import_structure(path: string): Promise<GroupNode[]>
{
	let group_nodes: GroupNode[] = [];

	const files = await fs.readdir(path, { withFileTypes: true });

	for (const file of files)
		if (file.isDirectory())
			group_nodes.push(await import_group_node(`${path}/${file.name}`));

	return group_nodes;
}


function flatten_structure(group_nodes: GroupNode[]): { [id: string]: MapTitle }
{
	let maps: { [id: string]: MapTitle } = {};

	for (const group_node of group_nodes)
	{
		for (const map of group_node.maps)
		{
			if (maps[map.id] !== undefined)
				throw new Error(`Duplicate map ID found: ${map.id}`);

			maps[map.id] = map;
		}

		const sub_maps = flatten_structure(group_node.sub_groups);

		for (const id in sub_maps)
		{
			if (maps[id] !== undefined)
				throw new Error(`Duplicate map ID found: ${id}`);

			maps[id] = sub_maps[id];
		}
	}

	return maps;
}


export const maps_structure = await import_structure(join(C.DATA_DIR, 'maps'));
export const map_titles = flatten_structure(maps_structure);


export async function import_datamap(id: string): Promise<DataMap>
{
	const map_title = map_titles[id];

	if (map_title === undefined)
		throw new NotFoundError(`Map not found: ${id}`);

	return {
		groups: map_title.groups,
		id: map_title.id,
		...JSON.parse(await fs.readFile(join(C.DATA_DIR, 'maps', ...map_title.groups.map(group => group.id), `${map_title.id}.json`), 'utf-8')),
		url: map_title.url,
	};
}


export async function import_map(id: string): Promise<{ map: Map, journals: { [id: string]: Journal } }>
{
	const data_map = await import_datamap(id);
	const journal_ids = await get_journal_ids();

	for (let i = 0; i < 50; i++)
		data_map.papers.push(generate_paper(data_map, journal_ids));

	const journals = await get_journals(
		data_map.papers
		.map((paper: DataPaper) => paper.journal.id)
		.filter((id: string | undefined) => id !== undefined) as string[]
	);

	let map = score_map(data_map, journals);

	return { map, journals };
}
