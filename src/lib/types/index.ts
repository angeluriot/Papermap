export enum Label
{
	Bug = 'bug',
	Duplicate = 'duplicate',
	MapUpdate = 'map update',
	NewFeature = 'new feature',
	NewMap = 'new map',
	Question = 'question',
	ScoringUpdate = 'scoring update',
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
