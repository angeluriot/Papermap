import type { Map } from '$lib/types/map';
import { clamp } from '$lib/utils';
import seedrandom from 'seedrandom';
import type { GraphStats } from './types';


const X_MIN_PADDING = 17;
const X_MAX_PADDING = 10;
const Y_MIN_PADDING = 20;
const Y_MAX_PADDING_LARGE = 20;
const Y_MAX_PADDING_TIGHT = 25;


export function get_stats(map: Map, width: number, height: number, top_margin_scale: number = 1, bottom_margin_scale: number = 1): GraphStats
{
	const scale = (width + height) * 0.001;

	const years = Object.values(map.papers).map(paper => paper.year + seedrandom(paper.title).quick());
	let min_year = 1950;
	let max_year = new Date().getFullYear();

	if (years.length > 0)
	{
		min_year = Math.min(...years);
		max_year = Math.max(...years);

		if (min_year === max_year)
		{
			min_year -= 1;
			max_year += 1;
		}
	}

	const pad_year = (max_year - min_year) / (width ** 0.7);

	const scores = Object.values(map.papers).map(paper => paper.score);
	let min_score = 0;
	let max_score = 1;

	if (scores.length > 0)
	{
		min_score = Math.min(...scores);
		max_score = Math.max(...scores);

		if (min_score === max_score)
		{
			min_score -= 0.1;
			max_score += 0.1;
		}
	}

	const pad_score = (max_score - min_score) / (height ** 0.7);

	return {
		min_year: min_year - pad_year * X_MIN_PADDING,
		max_year: max_year + pad_year * X_MAX_PADDING,
		min_score: min_score - pad_score * Y_MIN_PADDING * bottom_margin_scale,
		max_score: max_score + pad_score * (width <= 600 ? Y_MAX_PADDING_TIGHT : Y_MAX_PADDING_LARGE) * top_margin_scale,
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
