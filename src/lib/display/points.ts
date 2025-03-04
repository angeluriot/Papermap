import type { Map } from '$lib/types/map';
import { ratio } from '$lib/utils';
import type { GraphStats } from './types';
import { get_stats } from './utils';


const POINT_SIZE = 2;


export function get_graph_points(map: Map, stats: GraphStats): { x: number, y: number, size: number }[]
{
	return map.papers.map(paper => ({
		x: ratio(paper.year, stats.min_year, stats.max_year) * stats.width,
		y: ratio(paper.score.overall, stats.min_score, stats.max_score) * stats.height,
		size: (paper.review ? Math.sqrt(paper.review.count) : 1) * stats.scale * POINT_SIZE,
	}));
}
