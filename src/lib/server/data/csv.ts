import { constants as C } from '$lib/server/utils';
import type { Map } from '$lib/types/map';
import type { Journal } from '$lib/types/journal';
import { promises as fs } from 'fs';
import { join } from 'path';
import * as cards from '$lib/display/details/cards';
import { float_to_text } from '$lib/display/utils';
import { ConflictOfInterest, JournalMissingReason, MissingReason, PaperType, StudyOn } from '$lib/types/paper';


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
		Object.values(map.papers)
		.toSorted((a, b) => b.score - a.score)
		.map((paper) => ({
			title: paper.title,
			authors: array_to_string(paper.authors),
			journal: Object.keys(JournalMissingReason).includes(paper.journal.id) ? '' : journals[paper.journal.id].title,
			retracted: paper.journal.retracted ? 'Retracted' : '',
			year: paper.year,
			link: paper.link,
			consensus: paper.results.consensus === MissingReason.NotSpecified || paper.results.consensus === MissingReason.NoAccess ? '' : map.consensus[paper.results.consensus].text,
			conclusion: map.conclusions[paper.results.conclusion].text,
			quote: paper.quote,
			review: paper.review ? remove_uppercase(cards.TO_TEXT[paper.review.type]) : '',
			review_count: typeof paper.review?.count === 'number' ? paper.review.count : '',
			type: Object.keys(MissingReason).includes(paper.type) ? '' : remove_uppercase(cards.TO_TEXT[paper.type as PaperType]),
			on: Object.keys(MissingReason).includes(paper.on) ? '' : remove_uppercase(cards.TO_TEXT[paper.on as StudyOn]),
			citations: paper.citations === MissingReason.NotSpecified ? '' : paper.citations,
			sample_size: typeof paper.sample_size === 'number' ? paper.sample_size : '',
			p_value: typeof paper.p_value === 'object' ? (paper.p_value.less_than ? '<' : '') + float_to_text(paper.p_value.value) : '',
			conflict_of_interest: paper.conflict_of_interest === MissingReason.NoAccess ? '' : remove_uppercase(cards.TO_TEXT[paper.conflict_of_interest as ConflictOfInterest]),
			notes: paper.notes.map((note) => `${note.title}: ${note.description}`).join(' | '),
		}))
	);

	let csv = 'Title,Authors,Journal,Retracted,Year,Link,Previous consensus,Conclusion,Quote,Review,Review count,Type,On,Citations,Sample size,P value,Conflict of interest,Notes\n';

	for (const paper of papers)
		csv += Object.values(paper).map((value) => `"${value.toString().replaceAll(/"/g, '""')}"`).join(',') + '\n';

	await fs.writeFile(join(C.TMP_DIR, map.id, 'data.csv'), csv);
}
