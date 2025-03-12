import type { Font } from "./types";
import { constants as C } from '$lib/server/utils';
import { promises as fs } from 'fs';
import { join } from 'path';


async function import_font(dir: string, name: string, weight: string, display: string, style: string, file_types: string[]): Promise<Font>
{
	const ext_to_type: { [ext: string]: string } = {
		'ttf': 'truetype',
		'otf': 'opentype',
		'woff': 'woff',
		'woff2': 'woff2',
	};
	let files: { type: string, url: string, data: string }[] = [];

	for (let file_type of file_types)
	{
		const path = join(C.STATIC_DIR, 'fonts', dir, `${name}.${file_type}`);

		files.push({
			type: ext_to_type[file_type],
			url: path,
			data: (await fs.readFile(path)).toString('base64'),
		});
	}

	return {
		name,
		files,
		weight,
		display,
		style,
		sources: files.map(f => `url("data:font/${f.type};charset=utf-8;base64,${f.data}") format("${f.type}")`).join(', '),
	};
}


export const SatoshiVariable = await import_font('Satoshi', 'Satoshi-Variable', '300 900', 'swap', 'normal', ['ttf', 'woff', 'woff2']);
export const SatoshiRegular = await import_font('Satoshi', 'Satoshi-Regular', '400', 'swap', 'normal', ['ttf', 'woff', 'woff2']);
export const SatoshiMedium = await import_font('Satoshi', 'Satoshi-Medium', '500', 'swap', 'normal', ['ttf', 'woff', 'woff2']);
export const SatoshiBold = await import_font('Satoshi', 'Satoshi-Bold', '700', 'swap', 'normal', ['ttf', 'woff', 'woff2']);
export const SatoshiBlack = await import_font('Satoshi', 'Satoshi-Black', '900', 'swap', 'normal', ['ttf', 'woff', 'woff2']);
