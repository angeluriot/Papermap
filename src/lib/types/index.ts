export enum Label
{
	Bug = 'bug',
	Duplicate = 'duplicate',
	Enhancement = 'enhancement',
	MapUpdate = 'map update',
	NewMap = 'new map',
	PapersUpdate = 'papers update',
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
