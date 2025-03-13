import { score_answers, score_paper } from '$lib/server/data/score';
import { InvalidInternalDataError, NotFoundError } from '$lib/errors';
import type { Journal } from '$lib/types/journal';
import type { DataMap, Group, Map, Maps } from '$lib/types/map';
import { ReviewType, type DataPaper } from '$lib/types/paper';
import { constants as C } from '$lib/server/utils';
import { import_journals } from './journal';
import { validate_map } from './validate';


export const map_files = import.meta.glob('/src/lib/server/jsons/maps/**/*.json');


export async function import_group(group: string): Promise<Group>
{
	const file_path = `/src/lib/server/jsons/maps/${group}/_init_.json`;

	if (!map_files[file_path])
		throw new NotFoundError(`Group not found: ${group}`);

	return { id: group, ...(await map_files[file_path]() as any).default };
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
	const group_data = await import_group(group);
	const data = await import_datamap(group, id);
	const journals = await import_journals(data);

	let map: Map = {
		...data,
		group: group_data,
		id,
		papers: data.papers.map((paper: DataPaper) => score_paper(data, paper.journal.id ? journals[paper.journal.id] : undefined, paper)),
		overview: {}
	};

	for (let i = 0; i < 50; i++)
		map.papers.push(structuredClone(map.papers[0]));

	for (let paper of map.papers)
	{
		paper.title += ' ' + Math.random().toString(36).substring(2, 15);
		paper.score.overall = Math.random() * 0.5 + 0.25;
		paper.year = 2025 - Math.round(Math.random() * 50);

		if (Math.random() < 0.33)
			paper.review = { type: ReviewType.MetaAnalysis, count: 1 + Math.round((Math.random() ** 3) * 100) };

		const possibilities = [
			['positive'],
			['slightly_positive', 'positive_unlike_literature', 'positive_but_mixed_results'],
			['no_effect'],
			['negative_but_mixed_results', 'negative_unlike_literature', 'slightly_negative'],
			['negative']
		]

		const group = possibilities[Math.floor(Math.random() * possibilities.length)];
		paper.results.conclusion = group[Math.floor(Math.random() * group.length)];

		/*if (paper.results.conclusion === 'positive')
			paper.score.overall = Math.random() * 0.01 + 0.666;
		else if (paper.results.conclusion.includes('positive'))
			paper.score.overall = Math.random() * 0.01 + 0.58;
		else if (paper.results.conclusion === 'no_effect')
			paper.score.overall = Math.random() * 0.01 + 0.5;
		else if (paper.results.conclusion === 'negative')
			paper.score.overall = Math.random() * 0.01 + 0.3333;
		else
			paper.score.overall = Math.random() * 0.01 + 0.42;*/
	}

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

		maps[group].maps.push({ emoji: map_data.emoji, name: map_data.question.default, url });
	}

	return maps;
}
