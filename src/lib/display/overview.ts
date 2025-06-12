import { COLORS } from '$lib/colors';
import type { Map } from '$lib/types/map';
import type { GraphStats } from './graph/types';
import { cut_in_half } from './utils';


export function get_overview_by_color(map: Map)
{
	let data: {
		[group: string]: {
			x: number,
			color: string,
			width: number,
			ids: string[],
			label: {
				text: string[],
				type: 'left' | 'right' | null,
			},
		},
	} = {};

	for (const [answer_id, score] of Object.entries(map.overview))
	{
		const answer = map.conclusions[answer_id];
		const answer_group = map.conclusion_groups[answer.group];

		if (!data[answer.group])
		{
			data[answer.group] = {
				x: 0,
				color: COLORS[answer_group.color].default,
				width: 0,
				ids: [],
				label: {
					text: answer_group.text.length > 18 ? cut_in_half(answer_group.text) : [answer_group.text],
					type: null,
				},
			};
		}

		data[answer.group].width += score * 100;
		data[answer.group].ids.push(answer_id);
	}

	let result = Object.values(data).sort((a, b) => Object.keys(map.conclusions).indexOf(a.ids[0]) - Object.keys(map.conclusions).indexOf(b.ids[0]));
	let cursor = 0;

	for (let item of result)
	{
		item.x = cursor;
		cursor += item.width;
	}

	let first = 0;

	while (result[first].width < 0.0001)
		first++;

	let last = result.length - 1;

	while (result[last].width < 0.0001)
		last--;

	result[first].label.type = 'left';
	result[last].label.type = 'right';
	result[result.length - 1].width = 100;

	return result;
}


export function get_svg_overview_by_color(map: Map, stats: GraphStats, y: number, type: string, scale: number)
{
	let overview = get_overview_by_color(map);
	const width = stats.scale * 150 * scale;
	const height = stats.scale * 8 * scale;
	const font_size = stats.scale * 11.5 * scale;
	const line_height = font_size * 1.15;
	let cursor = 0;
	let two_lines = false;
	let final_y = y;

	for (let item of overview)
	{
		item.x = cursor;
		item.width = (item.width / 100) * width;

		if (item.label.type !== null && item.label.text.length > 1)
			two_lines = true;

		cursor += item.width;
	}

	if (two_lines)
	{
		if (type === 'image')
			final_y -= stats.scale * 8;

		else if (type === 'preview')
			final_y -= stats.scale * 3;
	}

	return {
		scale,
		groups: overview,
		font_size,
		line_height,
		text_gap: stats.scale * 5 * scale,
		width,
		height,
		y: final_y,
	};
}
