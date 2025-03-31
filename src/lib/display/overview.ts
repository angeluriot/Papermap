import { COLORS } from '$lib/colors';
import type { Map } from '$lib/types/map';
import type { GraphStats } from './graph/types';


export function get_overview_by_color(map: Map): { color: string, width: number, ids: string[], label: { text: string, opacity: number } }[]
{
	let data: { [color: string]: { color: string, width: number, ids: string[], label: { text: string, opacity: number } } } = {};

	for (const [answer_id, score] of Object.entries(map.overview))
	{
		const answer = map.conclusions[answer_id];
		const color = answer.color;

		if (!data[color])
		{
			data[color] = {
				color: COLORS[color].default,
				width: 0,
				ids: [],
				label: {
					text: answer.text,
					opacity: 0,
				},
			};
		}

		data[color].width += score * 100;
		data[color].ids.push(answer_id);
	}

	let result = Object.values(data).sort((a, b) => Object.keys(map.conclusions).indexOf(a.ids[0]) - Object.keys(map.conclusions).indexOf(b.ids[0]));

	result[0].label.opacity = result[0].width == 0 ? 0.5 : 1;
	result[result.length - 1].label.opacity = result[result.length - 1].width == 0 ? 0.5 : 1;
	result[result.length - 1].width = 100;

	return result;
}


export function get_svg_overview_by_color(map: Map, stats: GraphStats, y: number)
{
	let overview: any[] = get_overview_by_color(map);
	const width = stats.scale * 150;
	const height = stats.scale * 8;
	let cursor = 0;

	for (let item of overview)
	{
		item.x = cursor;
		item.width = (item.width / 100) * width;
		cursor += item.width;
	}

	return {
		groups: overview,
		font_size: stats.scale * 12,
		text_gap: stats.scale * 5,
		width,
		height,
		y,
	};
}
