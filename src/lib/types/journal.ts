export interface Journal
{
	id: string;
	title: string;
	link?: string;
	publisher?: string;
	score?: number;
	metrics: {
		h?: { value: number, score: number },
		if?: { value: number, score: number },
		cs?: { value: number, score: number },
		sjr?: { value: number, score: number },
		snip?: { value: number, score: number },
		ef?: { value: number, score: number },
		ai?: { value: number, score: number },
		self?: { value: number, score: number },
		rti?: { value: number, score: number },
		top?: { value: number, score: number },
		alt?: { value: number, score: number },
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


export function journal_to_light_journal(journal: Journal): LightJournal
{
	let light_journal: LightJournal = {
		id: journal.id,
		title: journal.title,
	};

	if (journal.link != undefined) light_journal.link = journal.link;
	if (journal.publisher != undefined) light_journal.publisher = journal.publisher;
	if (journal.score != undefined) light_journal.score = journal.score;

	return light_journal;
}
