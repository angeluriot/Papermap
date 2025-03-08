import type { PageServerLoad, EntryGenerator } from './$types';
import { constants as C } from '$lib/server/utils';
import { promises as fs } from 'fs';
import crypto from 'crypto';
import sharp from 'sharp';
import { join } from 'path';
import ejs from 'ejs';
import { import_map, map_files } from '$lib/server/data/map';
import { validate_params } from './validate';
import { ReviewType } from '$lib/types/paper';


export const prerender = true;
export const ssr = true;
export const csr = true;


export const load: PageServerLoad = async ({ params }: { params: { group: string, map: string } }) =>
{
	validate_params(params);
	const { map, journals } = await import_map(params.group, params.map);
	const font_data = (await fs.readFile(join(C.STATIC_DIR, 'fonts/Roboto/Roboto-Bold.ttf'))).toString('base64');
	const template = await fs.readFile(join(C.LIB_DIR, 'server/templates/image.svg.ejs'), 'utf-8');

	for (let i = 0; i < 50; i++)
		map.papers.push(structuredClone(map.papers[0]));

	for (let paper of map.papers)
	{
		paper.title += ' ' + Math.random().toString(36).substring(2, 15);
		paper.score.overall = Math.random() * 0.5 + 0.25;
		paper.year = 2025 - Math.round(Math.random() * 15);

		if (Math.random() < 0.33)
			paper.review = { type: ReviewType.MetaAnalysis, count: 1 + Math.round((Math.random() ** 3) * 100) };

		paper.results.conclusion = Object.keys(map.answers)[Math.floor(Math.random() * Object.keys(map.answers).length)];
	}

	const svg = ejs.render(template, {
		font_data,
		map,
		journals,
	});

	const image_hash = crypto.createHash('sha256').update(svg).digest('hex').slice(0, 16);
	const jpeg_buffer = await sharp(Buffer.from(svg)).jpeg({ quality: 95, progressive: true, chromaSubsampling: '4:4:4' }).toBuffer();
	const png_buffer = await sharp(Buffer.from(svg)).png().toBuffer();
	const dir = join(C.IMAGES_DIR, params.group);

	await fs.mkdir(dir, { recursive: true });

	await fs.writeFile(join(dir, `${params.map}.jpg`), jpeg_buffer);
	await fs.writeFile(join(dir, `${params.map}.png`), png_buffer);

	return {
		map,
		journals,
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
