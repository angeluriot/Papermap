import { COLORS } from '$lib/colors';
import type { Map } from '$lib/types/map';
import type { Paper } from '$lib/types/paper';
import { ratio } from '$lib/utils';
import type { GraphPoint, GraphStats } from './types';


const POINT_SIZE = 5;
const LABEL_PADDING = 4;
const LABEL_DISTANCE_LIMIT = 10;


function get_last_name(author: string): string
{
	const names = author.split(' ');
	return names[names.length - 1];
}


function get_title(paper: Paper): string
{
	if (paper.authors.length === 1)
		return get_last_name(paper.authors[0]) + '\n' + paper.year;

	if (paper.authors.length === 2)
		return get_last_name(paper.authors[0]) + ' & ' + get_last_name(paper.authors[1]) + '\n' + paper.year;

	return get_last_name(paper.authors[0]) + ' et al.\n' + paper.year;
}


export function get_graph_points(map: Map, stats: GraphStats): GraphPoint[]
{
	let points = map.papers.map((paper, index) => ({
		index,
		x: ratio(paper.year, stats.min_year, stats.max_year) * stats.width,
		y: ratio(paper.score.overall, stats.min_score, stats.max_score) * stats.height,
		size: (paper.review ? paper.review.count ** 0.3 : 1) * stats.sub_scales.point_size * POINT_SIZE,
		fill: COLORS[map.answers[paper.results.conclusion].color].fill,
		stroke: COLORS[map.answers[paper.results.conclusion].color].stroke,
		label: {
			x: 0,
			y: 0,
			text: get_title(paper),
			shown: true,
		},
	})).sort((a, b) => b.size - a.size);

	for (let point of points)
	{
		point.label.x = point.x;
		point.label.y = point.y + point.size + LABEL_PADDING * stats.sub_scales.point_stroke;
	}

	return points;
}
