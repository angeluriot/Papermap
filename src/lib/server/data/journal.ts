import { row_to_journal, row_to_light_journal, type Journal, type JournalRow, type LightJournal } from '$lib/types/journal';
import { constants as C } from '$lib/server/utils';
import { Pool } from 'pg';


const pool = new Pool({ connectionString: C.DB_URL });


export async function get_journal_ids(): Promise<{ id: string, proba: number }[]>
{
	const query = 'SELECT id, metric_h FROM journals;';
	const { rows } = await pool.query<{ id: string, metric_h: number | null }>(query);

	return rows.map((row) => ({
		id: row.id,
		proba: row.metric_h ?? 0.0,
	}));
}


export async function get_journal(id: string): Promise<LightJournal | null>
{
	const query = 'SELECT * FROM journals WHERE id = $1;';
	const { rows } = await pool.query<JournalRow>(query, [id]);

	if (rows.length === 0)
		return null;

	return row_to_light_journal(rows[0]);
}


export async function get_journals(ids: string[]): Promise<{ [id: string]: Journal }>
{
	let journals: { [id: string]: Journal } = {};

	if (ids.length === 0)
		return {};

	const query = 'SELECT * FROM journals WHERE id = ANY($1);';
	const { rows } = await pool.query<JournalRow>(query, [ids]);

	for (const row of rows)
	{
		const journal = row_to_journal(row);
		journals[journal.id] = journal;
	}

	return journals;
}
