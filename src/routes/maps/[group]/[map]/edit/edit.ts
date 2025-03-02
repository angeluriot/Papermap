import type { DataPaper } from '$lib/types/paper';
import { import_datamap } from '$lib/server/data/map';
import type { Edits } from './types';
import type { DataMap } from '$lib/types/map';


export async function edit_map(group: string, id: string, edits: Edits): Promise<DataMap>
{
	const map = await import_datamap(group, id);
	let papers: DataPaper[] = [];

	for (let i = 0; i < map.papers.length; i++)
	{
		if (edits.deleted.includes(i))
			continue;

		if (edits.edited[`${i}`])
			papers.push(edits.edited[`${i}`]);
		else
			papers.push(map.papers[i]);
	}

	papers = papers.concat(edits.added);
	papers.sort((a, b) => a.year !== b.year ? a.year - b.year : a.title.localeCompare(b.title));
	map.papers = papers;

	return map;
}
