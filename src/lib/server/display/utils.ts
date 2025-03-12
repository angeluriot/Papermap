import { Resvg } from '@resvg/resvg-js';
import type { Font } from '$lib/types';


export function rendered_text_size(text: string, font: Font, font_size: number): { width: number, height: number }
{
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="3000" height="200">
					<defs>
						<style type="text/css">
							@font-face
							{
								font-family: '${font.name}';
								src: ${font.sources};
								font-weight: ${font.weight};
								font-display: ${font.display};
								font-style: ${font.style};
							}
						</style>
					</defs>
					<text
						x="1500"
						y="100"
						font-family="${font.name}"
						font-size="${font_size}"
						fill="red"
						text-anchor="middle"
						alignment-baseline="central"
						dominant-baseline="central"
					>
						${text}
					</text>
				</svg>`;

	const resvg = new Resvg(svg, {
		fitTo: {
			mode: 'width',
			value: 2000,
		},
		font: {
			fontFiles: font.files.map(f => f.url),
			loadSystemFonts: false,
		},
	});

	const bbox = resvg.getBBox();

	if (!bbox)
		return { width: 0, height: 0 };

	return {
		width: bbox.width,
		height: bbox.height,
	};
}
