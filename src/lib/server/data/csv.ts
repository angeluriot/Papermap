import { constants as C } from '$lib/server/utils';
import type { Map } from '$lib/types/map';
import type { Journal } from '$lib/types/journal';
import { promises as fs } from 'fs';
import { join } from 'path';
import * as cards from '$lib/display/details/cards';
import { float_to_text } from '$lib/display/utils';
import { JournalMissingReason, MissingReason } from '$lib/types/paper';


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


function get_journal_text(journal: { id: string, retracted: boolean }, journals: { [id: string]: Journal }): string
{
	if (journal.id === JournalMissingReason.NotPublished)
		return '(Not published)';

	if (journal.id === JournalMissingReason.NotFound)
		return '(Not found)';

	return journals[journal.id].title;
}


function get_consensus_text(consensus: string, map: Map): string
{
	if (consensus === MissingReason.NotSpecified)
		return '(Not specified)';

	if (consensus === MissingReason.NoAccess)
		return '(No access)';

	return map.consensus[consensus].text;
}


function get_sample_size_text(sample_size: number | MissingReason): number | string
{
	if (sample_size === MissingReason.NotSpecified)
		return '(Not specified)';

	if (sample_size === MissingReason.NoAccess)
		return '(No access)';

	if (typeof sample_size !== 'number')
		return '';

	return sample_size;
}


function get_p_value_text(p_value: { less_than: boolean, value: number } | MissingReason): string
{
	if (p_value === MissingReason.NotSpecified)
		return '(Not specified)';

	if (p_value === MissingReason.NoAccess)
		return '(No access)';

	if (typeof p_value !== 'object')
		return '';

	return float_to_text(p_value.value);
}


export async function create_csv(map: Map, journals: { [id: string]: Journal }): Promise<void>
{
	const papers = (
		Object.values(map.papers)
		.toSorted((a, b) => b.score - a.score)
		.map((paper) => ({
			title: paper.title,
			authors: paper.institution ? paper.institution.name : array_to_string(paper.authors),
			year: paper.year,
			link: paper.link,
			journal: get_journal_text(paper.journal, journals),
			retracted: paper.journal.retracted ? 'Retracted' : '',
			citations: paper.citations,
			consensus: get_consensus_text(paper.results.consensus, map),
			conclusion: map.conclusions[paper.results.conclusion].text,
			indirect: paper.results.indirect ? 'Indirect' : '',
			quote: paper.quote,
			review: paper.review ? remove_uppercase(cards.TO_TEXT[paper.review.type]) : '',
			reviews: paper.review?.reviews ? 'Reviews' : '',
			review_count_estimate: paper.review?.estimate ? '≈' : '',
			review_count: typeof paper.review?.count === 'number' ? paper.review.count : (paper.review?.count === MissingReason.NoAccess ? '(No access)' : ''),
			type: paper.type === MissingReason.NoAccess ? '(No access)' : remove_uppercase(cards.TO_TEXT[paper.type]),
			blinding: paper.blinding === MissingReason.NoAccess ? '(No access)' : remove_uppercase(cards.TO_TEXT[paper.blinding]),
			sample_size: get_sample_size_text(paper.sample_size),
			p_value_less_than: typeof paper.p_value === 'object' && paper.p_value.less_than ? '<' : '',
			p_value: get_p_value_text(paper.p_value),
			conflict_of_interest: paper.conflict_of_interest === MissingReason.NoAccess ? '(No access)' : remove_uppercase(cards.TO_TEXT[paper.conflict_of_interest]),
			notes: paper.notes.map((note) => `${note.title}: ${note.description}`).join(' | '),
		}))
	);

	let csv = 'Title,Authors,Year,Link,Journal,Retracted,Citations,Previous consensus,Paper result,Indirect,Quote,Review,Review of reviews,Estimate,Review count,Type,Blinding,Sample size,Less than,P value,Conflict of interest,Notes\n';

	for (const paper of papers)
		csv += Object.values(paper).map((value) => `"${value.toString().replaceAll(/"/g, '""')}"`).join(',') + '\n';

	await fs.writeFile(join(C.TMP_DIR, map.id, 'data.csv'), csv);
}
