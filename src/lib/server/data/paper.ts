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

	result.journal = {
		id: paper.journal.id,
		retracted: paper.journal.retracted,
	};

	result.citations = {
		count: paper.citations.count,
		critics: paper.citations.critics,
	};

	result.results = {
		consensus: paper.results.consensus,
		conclusion: paper.results.conclusion,
		indirect: paper.results.indirect,
	};

	result.quote = paper.quote;

	if (paper.review !== undefined)
	{
		result.review = {
			type: paper.review.type,
			count: paper.review.count,
		};
	}

	result.type = paper.type;
	result.on = paper.on;
	result.sample_size = paper.sample_size;

	if (typeof paper.p_value === 'object')
		result.p_value = {
			value: paper.p_value.value,
			less_than: paper.p_value.less_than,
		};
	else
		result.p_value = paper.p_value;

	result.conflict_of_interest = paper.conflict_of_interest;

	result.notes = paper.notes.map((note: any) => ({
		title: note.title,
		description: note.description,
		impact: note.impact,
	}));

	return result;
}
