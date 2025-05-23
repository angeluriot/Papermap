export interface JournalTitle
{
	id: string;
	title: string;
	publisher?: string;
}


export interface Journal extends JournalTitle
{
	link?: string;
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
