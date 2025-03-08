import { COLORS } from '$lib/colors';
import type { Map } from '$lib/types/map';
import type { Paper } from '$lib/types/paper';
import { ratio } from '$lib/utils';
import type { GraphPoint, GraphStats } from './types';
import seedrandom from 'seedrandom';


export const POINT_SIZE = 5;
export const STROKE_WIDTH = 1.4;

export const LABEL_PADDING = 7;
export const FONT_SIZE = 5;
export const LINE_HEIGHT = FONT_SIZE * 1.2;


export function get_last_name(author: string): string
{
	const names = author.split(' ');
	return names[names.length - 1];
}


export function get_label(paper: Paper): string
{
	if (paper.authors.length === 1)
		return get_last_name(paper.authors[0]) + '\n' + paper.year;

	if (paper.authors.length === 2)
		return get_last_name(paper.authors[0]) + ' & ' + get_last_name(paper.authors[1]) + '\n' + paper.year;

	return get_last_name(paper.authors[0]) + ' et al.\n' + paper.year;
}


export function get_label_sizes(text: string, stats: GraphStats): { width: number, height: number }
{
	const text_max_width = text.split('\n').reduce((max, line) => Math.max(max, line.length), 0);

	return {
		width: 0.5 * text_max_width * FONT_SIZE * stats.sub_scales.point_stroke,
		height: 2.5 * FONT_SIZE * stats.sub_scales.point_stroke,
	}
}


export function rectangle_circle_intersection(rectangle: { x: number, y: number, width: number, height: number }, circle: { x: number, y: number, radius: number }): boolean
{
	const dx = Math.abs(circle.x - rectangle.x);
	const dy = Math.abs(circle.y - rectangle.y);

	if (dx > rectangle.width / 2 + circle.radius)
		return false;

	if (dy > rectangle.height / 2 + circle.radius)
		return false;

	if (dx <= rectangle.width / 2)
		return true;

	if (dy <= rectangle.height / 2)
		return true;

	const corner_distance = (dx - rectangle.width / 2) ** 2 + (dy - rectangle.height / 2) ** 2;
	return corner_distance <= circle.radius ** 2;
}


export function rectangle_rectangle_intersection(rectangle_1: { x: number, y: number, width: number, height: number }, rectangle_2: { x: number, y: number, width: number, height: number }): boolean
{
	const dx = Math.abs(rectangle_1.x - rectangle_2.x);
	const dy = Math.abs(rectangle_1.y - rectangle_2.y);

	const width = (rectangle_1.width + rectangle_2.width) / 2;
	const height = (rectangle_1.height + rectangle_2.height) / 2;

	return dx <= width && dy <= height;
}


export function get_graph_points(map: Map, stats: GraphStats): GraphPoint[]
{
	let points: GraphPoint[] = map.papers.map((paper, index) => ({
		index,
		x: ratio(paper.year + seedrandom(paper.title).quick(), stats.min_year, stats.max_year) * stats.width,
		y: ratio(paper.score.overall, stats.min_score, stats.max_score) * stats.height,
		size: (paper.review ? paper.review.count ** 0.3 : 1) * stats.sub_scales.point_size * POINT_SIZE,
		zoom: 0,
		fill: COLORS[map.answers[paper.results.conclusion].color].fill,
		stroke: {
			color: COLORS[map.answers[paper.results.conclusion].color].stroke,
			width: stats.sub_scales.point_stroke * STROKE_WIDTH,
		},
		label: {
			x: 0,
			y: 0,
			width: 0,
			height: 0,
			text: get_label(paper),
			font_size: stats.sub_scales.point_stroke * FONT_SIZE,
			line_height: stats.sub_scales.point_stroke * LINE_HEIGHT,
			shown: true,
		},
	})).sort((a, b) => b.size - a.size);

	for (let point of points)
	{
		point.zoom = (point.size + 0.5 * POINT_SIZE) / point.size;
		point.label.x = point.x;
		point.label.y = point.y + point.size + LABEL_PADDING * stats.sub_scales.point_stroke;
		point.label.width = get_label_sizes(point.label.text, stats).width;
		point.label.height = get_label_sizes(point.label.text, stats).height;

		for (let other of points)
		{
			if (other.index === point.index)
				continue;

			if (rectangle_circle_intersection(point.label, { x: other.x, y: other.y, radius: other.size }) ||
				(other.label.shown && rectangle_rectangle_intersection(point.label, other.label)) ||
				point.label.y + point.label.height / 2 > stats.height - 12 * stats.sub_scales.axis)
			{
				point.label.shown = false;
				break;
			}
		}
	}

	return points;
}
