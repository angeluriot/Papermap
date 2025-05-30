import type { DataPaper } from '$lib/types/paper';


export function sort_paper_attributes(paper: DataPaper): DataPaper
{
	let result: any = {};

	if (paper.id !== undefined)
		result.id = paper.id;

	result.title = paper.title;
	result.authors = paper.authors;
	result.year = paper.year;
	result.link = paper.link;

	let journal: any = {};

	journal.status = paper.journal.status;

	if (paper.journal.id !== undefined)
		journal.id = paper.journal.id;

	journal.retracted = paper.journal.retracted;

	result.journal = journal;

	result.citations = {
		count: paper.citations.count,
		critics: paper.citations.critics
	};

	result.results = {
		consensus: paper.results.consensus,
		conclusion: paper.results.conclusion,
		indirect: paper.results.indirect
	};

	result.quote = paper.quote;

	if (paper.review !== undefined)
	{
		result.review = {
			type: paper.review.type,
			count: paper.review.count
		};
	}

	if (paper.type !== undefined)
		result.type = paper.type;

	if (paper.on !== undefined)
		result.on = paper.on;

	if (paper.sample_size !== undefined)
		result.sample_size = paper.sample_size;

	if (paper.p_value !== undefined)
	{
		result.p_value = {
			value: paper.p_value.value,
			less_than: paper.p_value.less_than
		};
	}

	result.conflict_of_interest = paper.conflict_of_interest;

	result.notes = paper.notes.map((note: any) => ({
		title: note.title,
		description: note.description,
		impact: note.impact
	}));

	return result;
}
