import { constants as C } from '$lib/server/utils';
import { promises as fs } from 'fs';
import crypto from 'crypto';
import sharp from 'sharp';
import { join } from 'path';
import ejs from 'ejs';
import { ReviewType } from '$lib/types/paper';
import { get_stats } from '$lib/display/graph/utils';
import * as bg from '$lib/display/graph/background';
import * as pt from '$lib/display/graph/points';
import { Resvg } from '@resvg/resvg-js';
import { SatoshiMedium } from '$lib/fonts';
import { get_thumbnail_title, get_image_title, get_image_subtitle } from '$lib/server/display/title';
import type { Map } from '$lib/types/map';
import { get_svg_overview_by_color } from '$lib/display/overview';


export async function create_images(group: string, map: Map): Promise<string>
{
	const dir = join(C.IMAGES_DIR, group);
	await fs.mkdir(dir, { recursive: true });

	const svg_scales = {
		'thumbnail': { width: 1200, height: 630 },
		'image': { width: 1500, height: 1000 },
	};

	const image_scales = {
		'thumbnail': 1,
		'image': 2,
	};

	const types: ('thumbnail' | 'image')[] = ['thumbnail', 'image'];
	const font_scale = 1.7;
	let image_hash = '';

	for (let type of types)
	{
		const template = await fs.readFile(join(C.LIB_DIR, `server/templates/${type}.svg.ejs`), 'utf-8');

		const stats = get_stats(map, svg_scales[type].width, svg_scales[type].height, type === 'thumbnail' ? 1.3 : 0.5, 1.2);
		const x_axis = bg.get_x_axis(stats, font_scale);
		const y_axis = bg.get_y_axis(stats, x_axis, font_scale);
		const x_title = bg.get_x_title(stats, font_scale);
		const y_title = bg.get_y_title(stats, y_axis, font_scale);
		const background_points = bg.get_background_points(x_axis, y_axis, stats);
		const points = pt.get_graph_points(map, stats, font_scale);
		const margin = stats.scale * 16;
		const title = type === 'image' ? await get_image_title(map, stats) : await get_thumbnail_title(map, stats);
		const subtitle = type === 'image' ? await get_image_subtitle(map, stats, title.width) : null;

		const title_global_height = title.height + ((title as any)?.gap ?? 0) + (subtitle?.height ?? 0) + (subtitle?.bottom_margin ?? 0)
		const bottom_margin = 10;
		const global_width = type === 'image' ? svg_scales[type].width + margin * 2 : svg_scales[type].width;
		const global_height = type === 'image' ? svg_scales[type].height + title_global_height + margin * 2 + bottom_margin : svg_scales[type].height;

		const overview_y = (
			type === 'image' ?
			(title_global_height - (subtitle?.bottom_margin ?? 0)) / 2 + margin - stats.scale * 14 :
			((title as any)?.margin ?? 0) + ((title as any)?.padding_y ?? 0) + (title.height / 2) - stats.scale * 12
		);

		const overview = get_svg_overview_by_color(map, stats, overview_y);

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
			background_color: bg.BACKGROUND_COLOR,
			points_color: bg.POINTS_COLOR,
			points_opacity: bg.POINTS_OPACITY,
			axis_color: bg.AXIS_COLOR,
			title,
			subtitle,
			bottom_margin,
			overview,
		});

		if (type === 'thumbnail')
			image_hash = crypto.createHash('sha256').update(svg).digest('hex').slice(0, 16);

		const resvg = new Resvg(svg, {
			background: 'white',
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

		if (type === 'thumbnail')
			await fs.writeFile(join(dir, `${map.id}.jpg`), jpeg_buffer);
		else
		{
			await fs.writeFile(join(dir, `${map.id}.svg`), svg);
			await fs.writeFile(join(dir, `${map.id}.png`), png_buffer);
		}
	}

	return image_hash;
}
