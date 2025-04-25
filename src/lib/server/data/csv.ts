import { constants as C } from '$lib/server/utils';
import type { Map } from '$lib/types/map';
import type { Journal } from '$lib/types/journal';
import { promises as fs } from 'fs';
import { join } from 'path';
import * as cards from '$lib/display/details/cards';
import { float_to_text } from '$lib/display/utils';


function array_to_string(array: string[]): string
{
	if (array.length === 0)
		return '';

	if (array.length === 1)
		return array[0];

	return array.slice(0, -1).join(', ') + ' and ' + array[array.length - 1];
}


function remove_uppercase(text: string): string
{
	return text[0] + text.slice(1).toLowerCase();
}


export async function create_csv(map: Map, journals: { [id: string]: Journal }): Promise<void>
{
	const papers = (
		map.papers
		.toSorted((a, b) => b.score.overall - a.score.overall)
		.map((paper) => ({
			title: paper.title,
			authors: array_to_string(paper.authors),
			journal: paper.journal.id ? journals[paper.journal.id].titles[0] : '',
			retracted: paper.journal.retracted ? 'Retracted' : '',
			year: paper.year,
			link: paper.link,
			consensus: map.consensus[paper.results.consensus].text,
			conclusion: map.conclusions[paper.results.conclusion].text,
			quote: paper.quote,
			review: paper.review ? remove_uppercase(cards.TO_TEXT[paper.review.type]) : '',
			review_count: paper.review ? paper.review.count : '',
			type: paper.type ? remove_uppercase(cards.TO_TEXT[paper.type]) : '',
			on: paper.on ? remove_uppercase(cards.TO_TEXT[paper.on]) : '',
			citations: paper.citations.count,
			critics: paper.citations.critics ? 'Critics' : '',
			sample_size: paper.sample_size ?? '',
			p_value: paper.p_value ? (paper.p_value.less_than ? '<' : '') + float_to_text(paper.p_value.value) : '',
			conflict_of_interest: paper.conflict_of_interest ? 'Conflict of interest' : '',
			notes: paper.notes.map((note) => `${note.title}: ${note.description}`).join(', '),
		}))
	);

	let csv = 'Title,Authors,Journal,Retracted,Year,Link,Consensus,Conclusion,Quote,Review,Review count,Type,On,Citations,Critics,Sample size,P value,Conflict of interest,Notes\n';

	for (const paper of papers)
		csv += Object.values(paper).map((value) => `"${value.toString().replace(/"/g, '""')}"`).join(',') + '\n';

	await fs.writeFile(join(C.TMP_DIR, map.id, 'data.csv'), csv);
}
