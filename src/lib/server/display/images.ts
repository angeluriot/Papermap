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
import { get_title } from '$lib/server/display/title';
import type { Map } from '$lib/types/map';


export async function create_images(group: string, map: Map): Promise<string>
{
	const template = await fs.readFile(join(C.LIB_DIR, 'server/templates/image.svg.ejs'), 'utf-8');

	const dir = join(C.IMAGES_DIR, group);
	await fs.mkdir(dir, { recursive: true });

	const svg_scales = {
		'thumbnail': { width: 1280, height: 720 },
		'download': { width: 1500, height: 1000 },
	};

	const image_scales = {
		'thumbnail': { width: 1280, height: 720 },
		'download': { width: 3000, height: 2000 },
	};

	const types: ('thumbnail' | 'download')[] = ['thumbnail', 'download'];
	const font_scale = 1.5;
	let image_hash = '';

	for (let type of types)
	{
		const stats = get_stats(map, svg_scales[type].width, svg_scales[type].height, 1.2);
		const x_axis = bg.get_x_axis(stats, font_scale);
		const y_axis = bg.get_y_axis(stats, x_axis, font_scale);
		const x_title = bg.get_x_title(stats, font_scale);
		const y_title = bg.get_y_title(stats, y_axis, font_scale);
		const background_points = bg.get_background_points(x_axis, y_axis, stats);
		const points = pt.get_graph_points(map, stats, font_scale);
		const title = await get_title(map, stats);

		const svg = ejs.render(template, {
			font: SatoshiMedium,
			text_stroke: 0.5,
			map,
			width: svg_scales[type].width,
			height: svg_scales[type].height,
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
		});

		if (type === 'thumbnail')
			image_hash = crypto.createHash('sha256').update(svg).digest('hex').slice(0, 16);

		const resvg = new Resvg(svg, {
			background: bg.BACKGROUND_COLOR,
			fitTo: {
				mode: 'width',
				value: image_scales[type].width,
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
