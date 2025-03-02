import type { DataPaper } from "$lib/types/paper";


export interface PostParams
{
	group: string;
	map: string;
}


export interface Edits
{
	deleted: number[];
	edited: { [i: string]: DataPaper };
	added: DataPaper[];
}


export interface PostRequest
{
	username?: string;
	contact?: string;
	comment?: string;
	edits: Edits;
}
