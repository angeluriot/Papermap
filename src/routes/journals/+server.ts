import { import_journals } from '$lib/server/data/journal';
import { json } from '@sveltejs/kit';


export async function GET()
{
	const journals = await import_journals();

	return json({
		journals: Object.values(journals).map(j => { return { id: j.id, issns: j.issns, titles: j.titles, score: j.scores.oa }; })
	});
}
