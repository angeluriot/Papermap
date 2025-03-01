import type { Journal } from "$lib/types/journal";
import { import_journals } from "../../server/data/journal";


function clean_title(title: string): string
{
	return title.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().trim();
}


export async function seach_journals(titles: string[], issn?: string): Promise<Journal[]>
{
	const clean_issn = issn?.replace('-', '').toUpperCase().trim();
	const clean_titles = titles.map(title => clean_title(title));
	const journals = await import_journals();
	let results: { journal: Journal, score: number }[] = [];

	for (let journal of Object.values(journals))
	{
		let score = 0;

		if (clean_issn && journal.issns.includes(clean_issn))
			score += 100;

		for (let i = 0; i < titles.length; i++)
			for (let j = 0; j < journal.titles.length; j++)
				if (clean_titles[i] === clean_title(journal.titles[j]))
					score += i == 0 && j == 0 ? 10 : 1;

		if (score > 0)
			results.push({ journal, score });
	}

	return results.sort((a, b) => b.score - a.score).map(result => result.journal);
}
