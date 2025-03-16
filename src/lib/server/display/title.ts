import type { GraphStats } from '$lib/display/graph/types';
import { SatoshiMedium } from '$lib/fonts';
import type { Map } from '$lib/types/map';
import { rendered_text_size } from './utils';


export async function get_thumbnail_title(map: Map, stats: GraphStats)
{
	const margin = stats.width * 0.017;
	const padding_x = stats.width * 0.025;
	const padding_y = stats.width * 0.015;
	const font_size = stats.width * 0.024;
	const text_size = rendered_text_size(map.question.short, SatoshiMedium, font_size);

	return {
		margin,
		padding_x,
		padding_y,
		text: map.question.short,
		font_size,
		width: text_size.width,
		height: text_size.height,
	}
}


export async function get_image_title(map: Map, stats: GraphStats)
{
	const gap = stats.width * 0.006;
	const font_size = stats.width * 0.027;
	const text_size = rendered_text_size(map.question.short, SatoshiMedium, font_size);

	return {
		gap,
		text: map.question.short,
		font_size,
		width: text_size.width,
		height: text_size.height,
	}
}


export async function get_image_subtitle(map: Map, stats: GraphStats, title_width: number)
{
	const font_size = stats.width * 0.017;
	const line_height = font_size * 1.2;
	const bottom_margin = stats.width * 0.012;
	let lines: string[] = [''];

	for (let word of map.description.split(' '))
	{
		if (rendered_text_size(lines[lines.length - 1] + ' ' + word, SatoshiMedium, font_size).width > title_width * 1.05)
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
	}
}
