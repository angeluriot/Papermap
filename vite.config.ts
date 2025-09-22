import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import autoprefixer from 'autoprefixer';
import { defineConfig } from 'vite';
import devtoolsJson from 'vite-plugin-devtools-json';


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
