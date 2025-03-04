import type { Map } from '$lib/types/map';
import { get_stats } from './utils';
import { ratio } from '$lib/utils';
import type { GraphStats, Tick } from './types';


const PADDING = 5;
const MINOR_TICK_SIZE = 2.3;
const MAJOR_TICK_SIZE = 4.5;
const MINOR_TICK_COLOR = '#76798e';
const MAJOR_TICK_COLOR = '#2d2f3d';
const TICK_WIDTH = 1.2;


export function get_x_axis(stats: GraphStats): Tick[]
{
	const ticks: Tick[] = [];

	for (let i = Math.floor(stats.min_year - PADDING); i <= Math.ceil(stats.max_year + PADDING); i++)
	{
		const x = ratio(i, stats.min_year, stats.max_year) * stats.width;

		if (i % 10 === 0)
			ticks.push({
				start: { x, y: stats.height - stats.axis_scale * MAJOR_TICK_SIZE },
				end: { x, y: stats.height + stats.axis_scale * MAJOR_TICK_SIZE },
				color: MAJOR_TICK_COLOR,
				width: stats.axis_scale * TICK_WIDTH,
				value: i,
				type: 'major',
			});
		else
			ticks.push({
				start: { x, y: stats.height - stats.axis_scale * MINOR_TICK_SIZE },
				end: { x, y: stats.height + stats.axis_scale * MINOR_TICK_SIZE },
				color: MINOR_TICK_COLOR,
				width: stats.axis_scale * TICK_WIDTH,
				value: i,
				type: 'minor',
			});
	}

	return ticks;
}


export function get_y_axis(stats: GraphStats): Tick[]
{
	const ticks: Tick[] = [];

	for (let i = Math.floor(stats.min_score * 100 - PADDING); i <= Math.ceil(stats.max_score * 100 + PADDING); i++)
	{
		const y = (1 - ratio(i, stats.min_score * 100, stats.max_score * 100)) * stats.height;

		if (i % 10 === 0)
			ticks.push({
				start: { x: -stats.axis_scale * MAJOR_TICK_SIZE, y },
				end: { x: stats.axis_scale * MAJOR_TICK_SIZE, y },
				color: MAJOR_TICK_COLOR,
				width: stats.axis_scale * TICK_WIDTH,
				value: i / 100,
				type: 'major',
			});
		else
			ticks.push({
				start: { x: -stats.axis_scale * MINOR_TICK_SIZE, y },
				end: { x: stats.axis_scale * MINOR_TICK_SIZE, y },
				color: MINOR_TICK_COLOR,
				width: stats.axis_scale * TICK_WIDTH,
				value: i / 100,
				type: 'minor',
			});
	}

	return ticks;
}
