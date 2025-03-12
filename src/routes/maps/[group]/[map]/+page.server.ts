import type { PageServerLoad, EntryGenerator } from './$types';
import { constants as C } from '$lib/server/utils';
import { promises as fs } from 'fs';
import crypto from 'crypto';
import sharp from 'sharp';
import { join } from 'path';
import ejs from 'ejs';
import { import_map, import_maps, map_files } from '$lib/server/data/map';
import { validate_params } from './validate';
import { ReviewType } from '$lib/types/paper';
import { get_stats } from '$lib/display/graph/utils';
import * as bg from '$lib/display/graph/background';
import * as pt from '$lib/display/graph/points';
import { Resvg } from '@resvg/resvg-js';
import { SatoshiMedium } from '$lib/fonts';
import { get_title } from '$lib/server/display/title';


export const prerender = true;
export const ssr = true;
export const csr = true;


export const load: PageServerLoad = async ({ params }: { params: { group: string, map: string } }) =>
{
	validate_params(params);
	const { map, journals } = await import_map(params.group, params.map);

	const template = await fs.readFile(join(C.LIB_DIR, 'server/templates/image.svg.ejs'), 'utf-8');

	for (let i = 0; i < 50; i++)
		map.papers.push(structuredClone(map.papers[0]));

	for (let paper of map.papers)
	{
		paper.title += ' ' + Math.random().toString(36).substring(2, 15);
		paper.score.overall = Math.random() * 0.5 + 0.25;
		paper.year = 2025 - Math.round(Math.random() * 50);

		if (Math.random() < 0.33)
			paper.review = { type: ReviewType.MetaAnalysis, count: 1 + Math.round((Math.random() ** 3) * 100) };

		paper.results.conclusion = Object.keys(map.answers)[Math.floor(Math.random() * Object.keys(map.answers).length)];
	}

	const dir = join(C.IMAGES_DIR, params.group);
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
	let image_hash = null;

	for (let type of types)
	{
		const stats = get_stats(map, svg_scales[type].width, svg_scales[type].height, 1.2);
		const x_axis = bg.get_x_axis(stats, font_scale);
		const y_axis = bg.get_y_axis(stats, x_axis, font_scale);
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
			await fs.writeFile(join(dir, `${params.map}.jpg`), jpeg_buffer);
		else
		{
			await fs.writeFile(join(dir, `${params.map}.svg`), svg);
			await fs.writeFile(join(dir, `${params.map}.png`), png_buffer);
		}
	}

	return {
		map,
		journals,
		maps: await import_maps(),
		image_hash,
	};
};


export const entries: EntryGenerator = () =>
{
	let paths: { group: string, map: string }[] = [];

	for (const path of Object.keys(map_files))
	{
		const match = path.match('/src/lib/server/jsons/maps/(.+)/(.+).json');

		if (!match || match[2].startsWith('_'))
			continue;

		paths.push({
			group: match[1],
			map: match[2]
		});
	}

	return paths;
};
