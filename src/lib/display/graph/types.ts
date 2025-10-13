import type { Line, Point } from '$lib/types';


export interface Tick extends Line
{
	value: number;
	opacity: number;
	width: number;
	type: 'major' | 'minor' | null;
	label: {
		x: number,
		y: number,
		text: string,
		font_size: number,
	} | null;
}


export interface BackgroundPoint extends Point
{
	size: number;
}


export interface GraphPoint extends Point
{
	i: number;
	uuid: string;
	answer: string;
	size: number;
	focus_size: number;
	fill: string;
	stroke: {
		color: string,
		width: number,
		dasharray?: string,
	};
	opacity: number;
	label: {
		x: number,
		y: number,
		width: number,
		height: number,
		text: string,
		font_size: number,
		line_height: number,
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
		point_text: number,
	};
}
