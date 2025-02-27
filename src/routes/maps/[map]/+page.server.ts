import type { PageServerLoad, EntryGenerator } from './$types';
import { constants as C } from '$lib/server/utils';
import { promises as fs } from 'fs';
import crypto from 'crypto';
import sharp from 'sharp';
import { join } from 'path';
import ejs from 'ejs';
import { import_map, map_files } from '$lib/server/data/map';


export const prerender = true;
export const ssr = true;
export const csr = true;


export const load: PageServerLoad = async ({ params }: { params: { map: string } }) => {
	const map = await import_map(params.map);
	const font_data = (await fs.readFile(join(C.STATIC_DIR, 'fonts/Roboto/Roboto-Bold.ttf'))).toString('base64');
	const template = await fs.readFile(join(C.LIB_DIR, 'server/templates/image.svg.ejs'), 'utf-8');

	const svg = ejs.render(template, {
		font_data,
	});

	const image_hash = crypto.createHash('sha256').update(svg).digest('hex').slice(0, 16);
	const jpeg_buffer = await sharp(Buffer.from(svg)).jpeg({ quality: 95, progressive: true, chromaSubsampling: '4:4:4' }).toBuffer();

	const image_path = join(C.IMAGES_DIR, `${params.map}.jpg`);
	await fs.writeFile(image_path, jpeg_buffer);

	return {
		map: params.map,
		data: map,
		image_hash,
	};
};


export const entries: EntryGenerator = () => {
	return Object.keys(map_files).map((path) => {
		const match = path.match('/src/lib/server/jsons/maps/(.+).json');

		if (!match)
			throw new Error(`Invalid path: ${path}`);

		return {
			map: match[1]
		};
	});
};
