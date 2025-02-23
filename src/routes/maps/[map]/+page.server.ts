import { error } from '@sveltejs/kit';
import type { PageServerLoad, EntryGenerator } from './$types';
import { constants as C } from '$lib/server/utils';
import { promises as fs } from 'fs';
import crypto from 'crypto';
import sharp from 'sharp';
import { join } from 'path';
import ejs from 'ejs';


export const prerender = true;
export const ssr = true;
export const csr = true;

const data_modules = import.meta.glob('/src/lib/server/jsons/maps/*/question.json');


export const load: PageServerLoad = async ({ params }: { params: { map: string } }) => {
	const file_path = `/src/lib/server/jsons/maps/${params.map}/question.json`;

	if (!data_modules[file_path])
		throw error(404, 'Not found');

	const json_data = await data_modules[file_path]() as { default: any };
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
		data: json_data.default,
		image_hash,
	};
};


export const entries: EntryGenerator = () => {
	let a = Object.keys(data_modules).map((path) => {
		const match = path.match('/src/lib/server/jsons/maps/(.+)/question.json');

		if (!match)
			throw new Error(`Invalid path: ${path}`);

		return {
			map: match[1]
		};
	});
	console.log(a);
	return a;
};
