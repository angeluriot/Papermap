import type { Label } from '$lib/types';


export interface PostRequest
{
	username?: string;
	contact?: string;
	comment?: string;
	type: Label;
	group?: string;
	map?: string;
	journal?: string;
}
