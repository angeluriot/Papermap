import { import_journals } from '$lib/server/data/journal';
import { json, error as http_error } from '@sveltejs/kit';


export async function GET()
{
	try
	{
		const journals = await import_journals();

		return json({
			journals: Object.values(journals).map(j => { return { id: j.id, issns: j.issns, titles: j.titles, score: j.scores.oa }; })
		});
	}

	catch (error: any)
	{
		console.error(error);
		return http_error(500, { message: 'Internal server error' });
	}
}
