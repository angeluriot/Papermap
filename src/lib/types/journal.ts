export enum JournalType
{
	Journal = 'Journal',
	BookSeries = 'Book Series',
}


export interface Journal
{
	id: string;
	titles: string[];
	issns: string[];
	link?: string;
	publisher?: string;
	scopes: string[];
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
		oa?: number,
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
