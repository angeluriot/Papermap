export enum Label
{
	Bug = 'bug',
	JournalChange = 'journal change',
	MapChange = 'map change',
	NewJournal = 'new journal',
	NewMap = 'new map',
	OtherRequest = 'other request',
	Question = 'question',
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
