import type { Journal } from "$lib/types/journal";
import type { DataMap } from "$lib/types/map";
import { join } from 'path';
import { promises as fs } from 'fs';
import { constants as C } from '$lib/server/utils';


export async function import_journals(map?: DataMap): Promise<{ [id: string]: Journal }>
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
