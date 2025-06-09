import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import devtoolsJson from 'vite-plugin-devtools-json';
import autoprefixer from 'autoprefixer';


export default defineConfig({
	plugins: [
		sveltekit(),
		tailwindcss(),
		devtoolsJson(),
	],
	css: {
		postcss: {
			plugins: [
				autoprefixer({}),
			],
		},
	},
});
