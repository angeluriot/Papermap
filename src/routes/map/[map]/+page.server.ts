import { error } from '@sveltejs/kit';
import type { PageServerLoad, EntryGenerator } from './$types';
import { ENV } from '$lib/utils';
import fs from 'fs';
import crypto from 'crypto';
import sharp from 'sharp';

export const prerender = true;
export const ssr = true;
export const csr = true;

const data_modules = import.meta.glob('/src/lib/jsons/maps/*/question.json');

export const load: PageServerLoad = async ({ params }) => {
	const file_path = `/src/lib/jsons/maps/${params.map}/question.json`;

	if (!data_modules[file_path])
		throw error(404, 'Not found');

	const json_data = await data_modules[file_path]() as { default: any };

	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000">
		<rect width="1000" height="1000" fill="lightblue"/>
		<text x="500" y="500" font-size="50" text-anchor="middle" fill="darkblue">Example</text>
	</svg>`;

	const image_hash = crypto.createHash('sha256').update(svg).digest('hex').slice(0, 16);
	const jpeg_buffer = await sharp(Buffer.from(svg)).jpeg({ quality: 95, progressive: true, chromaSubsampling: '4:4:4' }).toBuffer();

	fs.mkdirSync(ENV.IMAGES_DIR, { recursive: true });

	const image_path = `${ENV.IMAGES_DIR}/${params.map}.jpg`;
	fs.writeFileSync(image_path, jpeg_buffer);

	return {
		map: params.map,
		data: json_data.default,
		image_hash
	};
};

export const entries: EntryGenerator = () => {
	let a = Object.keys(data_modules).map((path) => {
		const match = path.match('/src/lib/jsons/maps/(.+)/question.json');

		if (!match)
			throw new Error(`Invalid path: ${path}`);

		return {
			map: match[1]
		};
	});
	console.log(a);
	return a;
};
