import { COLORS } from '$lib/colors';
import type { Map } from '$lib/types/map';


export function get_overview_by_color(map: Map): { color: string, width: number, ids: string[], label: string | null }[]
{
	let data: { [color: string]: { color: string, width: number, ids: string[], label: string | null } } = {};

	for (const [answer_id, score] of Object.entries(map.overview))
	{
		const answer = map.answers[answer_id];
		const color = answer.color;

		if (!data[color])
		{
			data[color] = {
				color: COLORS[color].fill,
				width: 0,
				ids: [],
				label: answer.text,
			};
		}

		data[color].width += score * 100;
		data[color].ids.push(answer_id);
	}

	let result = Object.values(data).sort((a, b) => Object.keys(map.answers).indexOf(a.ids[0]) - Object.keys(map.answers).indexOf(b.ids[0]));

	for (let i = 1; i < result.length - 1; i++)
		result[i].label = null;

	result[result.length - 1].width = 100;

	return result;
}
