import { json } from '@sveltejs/kit';
import { create_issue } from '$lib/server/github';
import type { PostRequest } from './types';


export async function POST({ request }: { request: Request }): Promise<Response>
{
	const data = await request.json() as PostRequest;

	const issue_url = await create_issue(
		'Update question.json',
		'Test description' + (data.username ? ` - @${data.username}` : '') + (data.comment ? ` - ${data.comment}` : '') + (data.contact ? ` - ${data.contact}` : ''),
		data.type,
	);

	return json({ issue_url });
}
