import type { Map } from '$lib/types/map';
import { clamp } from '$lib/utils';
import seedrandom from 'seedrandom';
import type { GraphStats } from './types';


const X_MIN_PADDING = 17;
const X_MAX_PADDING = 10;
const Y_MIN_PADDING = 20;
const Y_MAX_PADDING = 20;


export function get_stats(map: Map, width: number, height: number): GraphStats
{
	const scale = (width + height) * 0.001;

	const years = map.papers.map(paper => paper.year + seedrandom(paper.title).quick());
	const min_year = Math.min(...years);
	const max_year = Math.max(...years);
	const pad_year = (max_year - min_year) / (width ** 0.7);

	const scores = map.papers.map(paper => paper.score.overall);
	const min_score = Math.min(...scores);
	const max_score = Math.max(...scores);
	const pad_score = (max_score - min_score) / (height ** 0.7);

	return {
		min_year: min_year - pad_year * X_MIN_PADDING,
		max_year: max_year + pad_year * X_MAX_PADDING,
		min_score: min_score - pad_score * Y_MIN_PADDING,
		max_score: max_score + pad_score * Y_MAX_PADDING,
		width,
		height,
		scale,
		sub_scales: {
			axis: clamp(scale * 0.3 + 1.2, 1.7, 2.25),
			point_size: clamp(scale * 0.7 + 1.0, 0, 3.5),
			point_stroke: clamp(scale * 0.5 + 1.5, 0, 3.5),
		},
	};
}
