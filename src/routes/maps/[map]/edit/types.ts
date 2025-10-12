import type { DataPaper } from '$lib/types/paper';


export interface Edits
{
	added: DataPaper[];
	edited: { [uuid: string]: DataPaper };
	deleted: string[];
}


export interface PostRequest
{
	comment?: string;
	discord_username?: string;
	edits: Edits;
}
