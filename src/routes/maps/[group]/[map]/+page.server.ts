import type { PageServerLoad, EntryGenerator } from './$types';
import { constants as C } from '$lib/server/utils';
import { promises as fs } from 'fs';
import crypto from 'crypto';
import sharp from 'sharp';
import { join } from 'path';
import ejs from 'ejs';
import { import_map, map_files } from '$lib/server/data/map';
import { validate_params } from './validate';


export const prerender = true;
export const ssr = true;
export const csr = true;


export const load: PageServerLoad = async ({ params }: { params: { group: string, map: string } }) =>
{
	validate_params(params);
	const { map, journals } = await import_map(params.group, params.map);
	const font_data = (await fs.readFile(join(C.STATIC_DIR, 'fonts/Roboto/Roboto-Bold.ttf'))).toString('base64');
	const template = await fs.readFile(join(C.LIB_DIR, 'server/templates/image.svg.ejs'), 'utf-8');

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
