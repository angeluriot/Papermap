import { clamp, ratio } from '$lib/utils';
import type { BackgroundPoint, GraphStats, Tick } from './types';


export const BACKGROUND_COLOR = '#f3f4ff';
export const POINTS_COLOR = '#3131ff';
export const POINTS_SIZE = 1.2;
export const POINTS_OPACITY = 0.12;

export const AXIS_COLOR = '#2d2f3d';
export const BEST_TICK_DISTANCE = 1.7;
export const X_PADDING = 5;
export const Y_PADDING = 3;
export const MINOR_TICK_SIZE = 2.3;
export const MAJOR_TICK_SIZE = 4.5;
export const MINOR_TICK_OPACITY = 0.5;
export const MAJOR_TICK_OPACITY = 1;
export const TICK_WIDTH = 1.4;

export const LABEL_FONT_SIZE = 7;
export const LABEL_DISTANCE = 2.8;
export const Y_LABEL_SHIFT = LABEL_FONT_SIZE * 0.04;

export const LABEL_MIN_SOFT_X = 14;
export const LABEL_MIN_HARD_X = 6;
export const LABEL_MAX_SOFT_X = 10.5;
export const LABEL_MAX_HARD_X = 1;

export const LABEL_MIN_SOFT_Y = 5;
export const LABEL_MIN_HARD_Y = 1.25;
export const LABEL_MAX_SOFT_Y = 9;
export const LABEL_MAX_HARD_Y = 5;

export const LABEL_CENTER_X = 29;
export const LABEL_CENTER_Y = 17;

export const POSSIBLE_X_SPACINGS = [
	[1, 1/12, 1/24],
	[1, 1/12, 1/12],
	[1, 1/3, 1/6],
	[1, 0.5, 1/4],
	[5, 1, 0.5],
	[10, 1, 1],
	[10, 2, 2],
	[20, 5, 2.5],
	[20, 5, 5],
	[20, 10, 10],
	[40, 20, 20],
	[50, 25, 25],
	[100, 50, 50],
];

export const POSSIBLE_Y_SPACINGS = [
	[0.01, 0.001, 0.001, 2],
	[0.02, 0.002, 0.002, 2],
	[0.05, 0.005, 0.005, 2],
	[0.1, 0.01, 0.01, 1],
	[0.1, 0.02, 0.02, 1],
	[0.2, 0.05, 0.05, 1],
	[0.5, 0.1, 0.1, 1],
];


export function get_x_axis_spacing(stats: GraphStats): { spacing: number[], tick_distance: number }
{
	const best_tick_distance = BEST_TICK_DISTANCE * stats.width ** 0.4;
	const possible_spacings = POSSIBLE_X_SPACINGS.map(spacing => ({
		spacing: spacing,
		distance: ratio(stats.min_year + spacing[2], stats.min_year, stats.max_year, false) * stats.width
	}));
	possible_spacings.sort((a, b) => Math.abs(a.distance - best_tick_distance) - Math.abs(b.distance - best_tick_distance));

	return {
		spacing: possible_spacings[0].spacing,
		tick_distance: possible_spacings[0].distance,
	};
}


export function get_x_axis(stats: GraphStats, font_scale: number = 1): Tick[]
{
	const s = stats.sub_scales.axis;
	const spacing = get_x_axis_spacing(stats).spacing;
	const number_scale = spacing[2] < 1 ? Math.round(1 / spacing[2]) : 10;
	const ticks: Tick[] = [];

	for (let i = Math.round(stats.min_year * number_scale) - X_PADDING; i <= Math.round(stats.max_year * number_scale) + X_PADDING; i++)
	{
		const scaled_i = i / number_scale;
		const x = ratio(scaled_i, stats.min_year, stats.max_year, false) * stats.width;

		if (x + (s * TICK_WIDTH) / 2 < 0 || x - (s * TICK_WIDTH) / 2 > stats.width)
			continue;

		const label_shown = x > s * LABEL_MIN_HARD_X && x < stats.width - s * LABEL_MAX_HARD_X

		if (i % Math.round(spacing[0] * number_scale) === 0)
			ticks.push({
				start: { x, y: stats.height - s * MAJOR_TICK_SIZE },
				end: { x, y: stats.height + s * MAJOR_TICK_SIZE },
				value: Math.round(scaled_i),
				opacity: MAJOR_TICK_OPACITY,
				width: s * TICK_WIDTH,
				type: 'major',
				label: label_shown ? {
					x: clamp(x, LABEL_MIN_SOFT_X * s, stats.width - LABEL_MAX_SOFT_X * s),
					y: stats.height - s * (MAJOR_TICK_SIZE + LABEL_DISTANCE),
					text: scaled_i.toString(),
					font_size: s * LABEL_FONT_SIZE * font_scale,
				} : null,
			});
		else if (i % Math.round(spacing[1] * number_scale) === 0)
			ticks.push({
				start: { x, y: stats.height - s * MINOR_TICK_SIZE },
				end: { x, y: stats.height + s * MINOR_TICK_SIZE },
				value: scaled_i,
				opacity: MINOR_TICK_OPACITY,
				width: s * TICK_WIDTH,
				type: 'minor',
				label: null,
			});
		else if (i % Math.round(spacing[2] * number_scale) === 0)
			ticks.push({
				start: { x, y: 0 },
				end: { x, y: 0 },
				value: scaled_i,
				opacity: 0,
				width: s * TICK_WIDTH,
				type: null,
				label: null,
			});
	}

	return ticks;
}

export function get_y_axis_spacing(stats: GraphStats): number[]
{
	const best_tick_distance = get_x_axis_spacing(stats).tick_distance;
	const possible_spacings = POSSIBLE_Y_SPACINGS.map(spacing => ({
		spacing: spacing,
		score: Math.abs(ratio(stats.min_score + spacing[2], stats.min_score, stats.max_score, false) * stats.height - best_tick_distance)
	}));

	return possible_spacings.sort((a, b) => a.score - b.score)[0].spacing;
}


export function get_y_axis(stats: GraphStats, x_axis: Tick[], font_scale: number = 1): Tick[]
{
	const s = stats.sub_scales.axis;
	const spacing = get_y_axis_spacing(stats);
	const number_scale = Math.round(1 / spacing[2]);
	const ticks: Tick[] = [];

	for (let i = Math.round(stats.min_score * number_scale) - Y_PADDING; i <= Math.round(stats.max_score * number_scale) + Y_PADDING; i++)
	{
		const scaled_i = i / number_scale;
		const y = (1 - ratio(scaled_i, stats.min_score, stats.max_score, false)) * stats.height;
		const x_in_center = x_axis.find(
			tick => tick.label !== null && tick.start.x > s * LABEL_MIN_HARD_X && tick.start.x < s * LABEL_CENTER_X
		) !== undefined;
		const label_shown = (
			y > s * LABEL_MIN_HARD_Y &&
			y < stats.height - s * LABEL_MAX_HARD_Y &&
			!(x_in_center && y > stats.height - s * LABEL_CENTER_Y)
		);

		if (y + (s * TICK_WIDTH) / 2 < 0 || y - (s * TICK_WIDTH) / 2 > stats.height)
			continue;

		if (i % Math.round(spacing[0] * number_scale) === 0)
			ticks.push({
				start: { x: -s * MAJOR_TICK_SIZE, y },
				end: { x: s * MAJOR_TICK_SIZE, y },
				value: scaled_i,
				opacity: MAJOR_TICK_OPACITY,
				width: s * TICK_WIDTH,
				type: 'major',
				label: label_shown ? {
					x: s * (MAJOR_TICK_SIZE + LABEL_DISTANCE),
					y: clamp(y - s * Y_LABEL_SHIFT * font_scale, s * LABEL_MIN_SOFT_Y, stats.height - s * LABEL_MAX_SOFT_Y),
					text: scaled_i.toFixed(spacing[3]),
					font_size: s * LABEL_FONT_SIZE * font_scale,
				} : null,
			});
		else if (i % Math.round(spacing[1] * number_scale) === 0)
			ticks.push({
				start: { x: -s * MINOR_TICK_SIZE, y },
				end: { x: s * MINOR_TICK_SIZE, y },
				value: Math.round(scaled_i),
				opacity: MINOR_TICK_OPACITY,
				width: s * TICK_WIDTH,
				type: 'minor',
				label: null,
			});
		else if (i % Math.round(spacing[2] * number_scale) === 0)
			ticks.push({
				start: { x: 0, y },
				end: { x: 0, y },
				value: Math.round(scaled_i),
				opacity: 0,
				width: s * TICK_WIDTH,
				type: null,
				label: null,
			});
	}

	return ticks;
}


export function get_background_points(x_ticks: Tick[], y_ticks: Tick[], stats: GraphStats): BackgroundPoint[]
{
	let points: BackgroundPoint[] = [];

	for (let x = 0; x < x_ticks.length; x++)
		for (let y = 0; y < y_ticks.length; y++)
			points.push({
				x: x_ticks[x].start.x,
				y: y_ticks[y].start.y,
				size: stats.sub_scales.axis * POINTS_SIZE,
			});

	return points;
}
