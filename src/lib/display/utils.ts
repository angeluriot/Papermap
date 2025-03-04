import type { Map } from '$lib/types/map';
import { clamp } from '$lib/utils';
import type { GraphStats } from './types';


const PADDING = 0.1


export function get_stats(map: Map, width: number, height: number): GraphStats
{
	const scale = (width + height) * 0.001;

	const years = map.papers.map(paper => paper.year);
	const min_year = Math.min(...years);
	const max_year = Math.max(...years);
	const pad_year = (max_year - min_year) * PADDING;

	const scores = map.papers.map(paper => paper.score.overall);
	const min_score = Math.min(...scores);
	const max_score = Math.max(...scores);
	const pad_score = (max_score - min_score) * PADDING;

	return {
		min_year: min_year - pad_year,
		max_year: max_year + pad_year,
		min_score: min_score - pad_score,
		max_score: max_score + pad_score,
		width,
		height,
		scale,
		axis_scale: clamp(scale * 0.3 + 1.2, 1.7, 2.25),
	}
}
