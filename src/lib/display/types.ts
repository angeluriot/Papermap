import type { Line } from '$lib/types';


export interface DisplayedLine extends Line
{
	color: string;
	width: number;
}


export interface Tick extends DisplayedLine
{
	value: number;
	type: 'major' | 'minor';
}


export interface GraphStats
{
	min_year: number;
	max_year: number;
	min_score: number;
	max_score: number;
	width: number;
	height: number;
	scale: number;
	axis_scale: number;
}
