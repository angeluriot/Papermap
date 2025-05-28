import type { DataPaper } from '$lib/types/paper';


export interface Edits
{
	deleted: number[];
	edited: { [i: string]: DataPaper };
	added: DataPaper[];
}


export interface PostRequest
{
	comment?: string;
	discord_username?: string;
	edits: Edits;
}
