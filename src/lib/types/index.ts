export enum Label
{
	JournalChange = 'journal change',
	JournalDeletion = 'journal deletion',
	NewJournal = 'new journal',
	MapChange = 'map change',
	MapDeletion = 'map deletion',
	NewMap = 'new map',
	OtherRequest = 'other request',
}


export interface Point
{
	x: number;
	y: number;
}


export interface Line
{
	start: Point;
	end: Point;
}


export interface Font
{
	name: string;
	files: {
		type: string,
		url: string,
		data: string,
	}[];
	weight: string;
	display: string;
	style: string;
	sources: string;
}
