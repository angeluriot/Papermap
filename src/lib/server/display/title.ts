import { rendered_text_size } from './utils';
import type { GraphStats } from '$lib/display/graph/types';
import { SatoshiMedium } from '$lib/server/fonts';
import type { Map } from '$lib/types/map';


export async function get_preview_title(map: Map, stats: GraphStats, shown: boolean)
{
	const margin = stats.width * 0.017;
	const padding_x = stats.width * 0.025;
	const padding_y = stats.width * 0.015;
	const font_size = stats.width * 0.024;
	const text_width = rendered_text_size(map.question.short, SatoshiMedium, font_size).width;
	const text_height = rendered_text_size(map.question.short + 'g', SatoshiMedium, font_size).height;

	return {
		shown,
		margin,
		padding_x,
		padding_y,
		text: map.question.short,
		font_size,
		width: text_width,
		height: text_height,
	};
}


export async function get_image_title(map: Map, stats: GraphStats)
{
	const gap = stats.width * 0.006;
	const font_size = stats.width * 0.027;
	const text_width = rendered_text_size(map.question.short, SatoshiMedium, font_size).width;
	const text_height = rendered_text_size(map.question.short + 'g', SatoshiMedium, font_size).height;

	return {
		gap,
		text: map.question.short,
		font_size,
		width: text_width,
		height: text_height,
	};
}


export async function get_image_subtitle(map: Map, stats: GraphStats)
{
	const font_size = stats.width * 0.017;
	const line_height = font_size * 1.2;
	const bottom_margin = stats.width * 0.012;
	const width = stats.width * 0.6;
	const lines: string[] = [''];

	for (const word of map.description.split(' '))
	{
		if (rendered_text_size(lines[lines.length - 1] + ' ' + word, SatoshiMedium, font_size).width > width * 1.05)
			lines.push(word);
		else
			lines[lines.length - 1] += ' ' + word;
	}

	return {
		lines,
		font_size,
		line_height,
		height: lines.length * line_height,
		bottom_margin,
	};
}
