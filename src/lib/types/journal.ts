export interface JournalRow
{
	id: string;
	title: string;
	link?: string;
	publisher?: string;
	score?: number;
	metric_h?: number;
	metric_if?: number;
	metric_cs?: number;
	metric_sjr?: number;
	metric_snip?: number;
	metric_ef?: number;
	metric_ai?: number;
	metric_self?: number;
	metric_rti?: number;
	metric_top?: number;
	metric_alt?: number;
	score_oa?: number;
	score_h?: number;
	score_if?: number;
	score_cs?: number;
	score_sjr?: number;
	score_snip?: number;
	score_ef?: number;
	score_ai?: number;
	score_self?: number;
	score_rti?: number;
	score_top?: number;
	score_alt?: number;
}


export interface Journal
{
	id: string;
	title: string;
	link?: string;
	publisher?: string;
	score?: number;
	metrics: {
		h?: number,
		if?: number,
		cs?: number,
		sjr?: number,
		snip?: number,
		ef?: number,
		ai?: number,
		self?: number,
		rti?: number,
		top?: number,
		alt?: number,
	};
	scores: {
		h?: number,
		if?: number,
		cs?: number,
		sjr?: number,
		snip?: number,
		ef?: number,
		ai?: number,
		self?: number,
		rti?: number,
		top?: number,
		alt?: number,
	};
}


export interface LightJournal
{
	id: string;
	title: string;
	link?: string;
	publisher?: string;
	score?: number;
}


export function row_to_light_journal(row: JournalRow): LightJournal
{
	let journal: LightJournal = {
		id: row.id,
		title: row.title,
	};

	if (row.link != null) journal.link = row.link;
	if (row.publisher != null) journal.publisher = row.publisher;
	if (row.score != null) journal.score = row.score;

	return journal;
}


export function row_to_journal(row: JournalRow): Journal
{
	let journal: Journal = {
		id: row.id,
		title: row.title,
		metrics: {},
		scores: {}
	};

	if (row.link != null) journal.link = row.link;
	if (row.publisher != null) journal.publisher = row.publisher;
	if (row.score != null) journal.score = row.score;

	const metric_keys = ['h','if','cs','sjr','snip','ef','ai','self','rti','top','alt'] as const;

	metric_keys.forEach(key =>
	{
		const val = row[`metric_${key}` as keyof JournalRow];

		if (val !== null && val !== undefined)
			// @ts-ignore
			journal.metrics[key] = val;
	});

	metric_keys.forEach(key =>
	{
		const val = row[`score_${key}` as keyof JournalRow];

		if (val !== null && val !== undefined)
			// @ts-ignore
			journal.scores[key] = val;
	});

	return journal;
}
