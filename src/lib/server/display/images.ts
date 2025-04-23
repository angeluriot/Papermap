import { constants as C } from '$lib/server/utils';
import { promises as fs } from 'fs';
import sharp from 'sharp';
import { join } from 'path';
import ejs from 'ejs';
import { get_stats } from '$lib/display/graph/utils';
import * as bg from '$lib/display/graph/background';
import * as pt from '$lib/display/graph/points';
import { Resvg } from '@resvg/resvg-js';
import { SatoshiMedium } from '$lib/fonts';
import { get_preview_title, get_image_title, get_image_subtitle } from '$lib/server/display/title';
import type { Map } from '$lib/types/map';
import { get_svg_overview_by_color } from '$lib/display/overview';


export async function create_images(group: string, map: Map): Promise<void>
{
	const dir = join(C.TMP_DIR, group, map.id);
	await fs.mkdir(dir, { recursive: true });

	const svg_scales = {
		'preview': { width: 1200, height: 630 },
		'thumbnail': { width: 800, height: 450 },
		'image': { width: 1500, height: 1000 },
	};

	const image_scales = {
		'preview': 1,
		'thumbnail': 0.8,
		'image': 2,
	};

	const types: ('preview' | 'thumbnail' | 'image')[] = ['preview', 'thumbnail', 'image'];
	const font_scale = 1.7;

	for (let type of types)
	{
		const template = await fs.readFile(join(C.LIB_DIR, `server/templates/${type === 'thumbnail' ? 'preview' : type}.svg.ejs`), 'utf-8');

		const stats = get_stats(map, svg_scales[type].width, svg_scales[type].height, type === 'preview' ? 1.3 : 0.5, 1.2);
		const x_axis = bg.get_x_axis(stats, font_scale);
		const y_axis = bg.get_y_axis(stats, x_axis, font_scale);
		const x_title = bg.get_x_title(stats, font_scale);
		const y_title = bg.get_y_title(stats, y_axis, font_scale);
		const background_points = bg.get_background_points(x_axis, y_axis, stats);
		const points = pt.get_graph_points(map, stats, font_scale);
		const margin = stats.scale * 14;
		const title = type === 'image' ? await get_image_title(map, stats) : await get_preview_title(map, stats, type === 'preview');
		const subtitle = type === 'image' ? await get_image_subtitle(map, stats, title.width) : null;

		const title_global_height = title.height + ((title as any)?.gap ?? 0) + (subtitle?.height ?? 0) + (subtitle?.bottom_margin ?? 0)
		const bottom_margin = 8;
		const global_width = type === 'image' ? svg_scales[type].width + margin * 2 : svg_scales[type].width;
		const global_height = type === 'image' ? svg_scales[type].height + title_global_height + margin * 2 + bottom_margin : svg_scales[type].height;

		const overview_y = (
			type === 'image' ?
			(title_global_height - (subtitle?.bottom_margin ?? 0)) / 2 + margin - stats.scale * 14 :
			((title as any)?.margin ?? 0) + ((title as any)?.padding_y ?? 0) + (title.height / 2) - stats.scale * 12
		);

		const overview = get_svg_overview_by_color(map, stats, overview_y, type, type === 'thumbnail' ? 1.5 : 1);

		const svg = ejs.render(template, {
			template_dir: join(C.LIB_DIR, 'server', 'templates'),
			font: SatoshiMedium,
			text_stroke: 0.25,
			overview_text_stroke: type === 'image' ? 0.15 : 0.25,
			map,
			width: svg_scales[type].width,
			height: svg_scales[type].height,
			global_width,
			global_height,
			margin,
			title_global_height,
			stats,
			x_axis,
			y_axis,
			x_title,
			y_title,
			background_points,
			points,
			background_color: type === 'thumbnail' ? '#fdfdff' : bg.BACKGROUND_COLOR,
			points_color: bg.POINTS_COLOR,
			points_opacity: bg.POINTS_OPACITY,
			axis_color: bg.AXIS_COLOR,
			title,
			subtitle,
			bottom_margin,
			overview,
		});

		const resvg = new Resvg(svg, {
			background: type === 'image' ? 'white' : bg.BACKGROUND_COLOR,
			fitTo: {
				mode: 'width',
				value: global_width * image_scales[type],
			},
			font: {
				fontFiles: SatoshiMedium.files.map(f => f.url),
				loadSystemFonts: false,
			},
		});

		const png_buffer = resvg.render().asPng();
		const jpeg_buffer = await sharp(png_buffer).jpeg({ quality: 90, progressive: true, chromaSubsampling: '4:4:4' }).toBuffer();
		const webp_buffer = await sharp(png_buffer).webp({ quality: 90, lossless: true }).toBuffer();

		if (type === 'preview')
			await fs.writeFile(join(dir, 'preview.jpg'), jpeg_buffer);
		else if (type === 'thumbnail')
			await fs.writeFile(join(dir, 'thumbnail.webp'), webp_buffer);
		else
		{
			await fs.writeFile(join(dir, 'image.svg'), svg);
			await fs.writeFile(join(dir, 'image.png'), png_buffer);
		}
	}
}
