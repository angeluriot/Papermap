import type { Journal } from '$lib/types/journal';
import { clean_text } from '../utils';


export async function search_journal(title: string): Promise<Journal | null>
{
	return null;

	/*if (!title && !issns)
		return null;

	const clean_issns = (issns ?? []).map(issn => issn.replace('-', '').toUpperCase().trim());
	const clean_title = clean_text(title ?? '');
	const journals = await import_journals();
	let results: { journal: Journal, score: number }[] = [];

	for (let journal of Object.values(journals))
	{
		let score = 0;

		for (const clean_issn of clean_issns)
			if (journal.issns.includes(clean_issn))
				score += 100;

		if (clean_title)
			for (let i = 0; i < Math.min(journal.titles.length, 10); i++)
				if (clean_title === clean_text(journal.titles[i]))
					score += 10 - i;

		if (score > 0)
			results.push({ journal, score });
	}

	if (results.length === 0)
		return null;

	return results.reduce((a, b) => a.score > b.score ? a : b).journal;*/
}
