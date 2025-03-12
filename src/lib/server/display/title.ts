import type { GraphStats } from '$lib/display/graph/types';
import { SatoshiMedium } from '$lib/fonts';
import type { Map } from '$lib/types/map';
import { rendered_text_size } from './utils';


export async function get_title(map: Map, stats: GraphStats)
{
	const margin = stats.width * 0.017;
	const padding_x = stats.width * 0.025;
	const padding_y = stats.width * 0.015;
	const font_size = stats.width * 0.023;
	const text_size = rendered_text_size(map.question.short, SatoshiMedium, font_size);

	return {
		font: SatoshiMedium,
		margin,
		padding_x,
		padding_y,
		text: map.question.short,
		font_size,
		width: text_size.width,
		height: text_size.height,
	}
}
