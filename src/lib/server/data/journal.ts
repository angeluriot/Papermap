import { journal_to_light_journal, type Journal, type LightJournal } from '$lib/types/journal';
import { constants as C } from '$lib/server/utils';
import { join } from 'path';
import fs from 'fs';
import readline from 'readline';


let index: Record<string, [number, number]> | undefined = undefined;


async function init()
{
	index = JSON.parse(await fs.promises.readFile(join(C.DATA_DIR, 'index.json'), 'utf-8'));
}


export async function get_journal_ids(): Promise<{ id: string, proba: number }[]>
{
	const file_stream = fs.createReadStream(join(C.DATA_DIR, 'journals.jsonl'), { encoding: 'utf-8' });
	const rl = readline.createInterface({ input: file_stream, crlfDelay: Infinity });

	let journals: { id: string, proba: number }[] = [];

	for await (const line of rl)
	{
		const journal = JSON.parse(line) as Journal;
		journals.push({ id: journal.id, proba: journal.metrics?.h?.value ?? 0 });
	}

	return journals;
}


export async function get_journal(id: string): Promise<LightJournal | null>
{
	if (!index)
		await init();

	const result = (index as Record<string, [number, number]>)[id];

	if (result === undefined)
		return null;

	const [start, length] = result;
	const file = await fs.promises.open(join(C.DATA_DIR, 'journals.jsonl'), 'r');
	const buffer = Buffer.alloc(length);
	await file.read(buffer, 0, length, start);
	await file.close();

	const journal = JSON.parse(buffer.toString('utf-8')) as Journal;
	return journal_to_light_journal(journal);
}


export async function get_journals(ids: string[]): Promise<{ [id: string]: Journal }>
{
	if (!index)
		await init();

	let id_list = [...new Set(ids)];
	let journals: { [id: string]: Journal } = {};

	if (id_list.length === 0)
		return {};

	const file = await fs.promises.open(join(C.DATA_DIR, 'journals.jsonl'), 'r');

	for (const id of id_list)
	{
		const result = (index as Record<string, [number, number]>)[id];

		if (result === undefined)
			continue;

		const [start, length] = result;
		const buffer = Buffer.alloc(length);
		await file.read(buffer, 0, length, start);
		const journal = JSON.parse(buffer.toString('utf-8')) as Journal;
		journals[journal.id] = journal;
	}

	await file.close();

	return journals;
}
