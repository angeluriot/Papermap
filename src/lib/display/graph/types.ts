import type { Line } from '$lib/types';


export interface DisplayedLine extends Line
{
	color: string;
	width: number;
}


export interface Tick extends Line
{
	value: number;
	value_text: string;
	type: 'major' | 'minor' | null;
}


export interface GraphPoint
{
	index: number;
	x: number;
	y: number;
	size: number;
	fill: string;
	stroke: string;
	label: {
		x: number,
		y: number,
		width: number,
		height: number,
		text: string,
		shown: boolean,
	};
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
	sub_scales: {
		axis: number,
		point_size: number,
		point_stroke: number,
	};
}
