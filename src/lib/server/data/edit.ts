import type { DataPaper } from '$lib/types/paper';
import { import_datamap } from './map';


export async function edit_map(id: string, edits: { [i: number]: DataPaper | null })
{
	const map = await import_datamap(id);
	let papers: DataPaper[] = [];

	for (let i = 0; i < map.papers.length; i++)
	{
		const edit = edits[i];

		if (edit === null)
			continue;

		if (edit)
			papers.push(edit);
		else
			papers.push(map.papers[i]);
	}

	papers.sort((a, b) => a.year - b.year);
	map.papers = papers;

	return map;
}
