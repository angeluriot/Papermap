import { fileURLToPath } from 'node:url';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';
//import stylistic from '@stylistic/eslint-plugin';

const gitignore_path = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default defineConfig(
	includeIgnoreFile(gitignore_path),
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
		},
		plugins: {
			//'@stylistic': stylistic,
		},
		rules: {
			// TypeScript
			'no-undef': 'off',
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					'args': 'all',
					'argsIgnorePattern': '^_',
					'caughtErrors': 'all',
					'caughtErrorsIgnorePattern': '^_',
					'destructuredArrayIgnorePattern': '^_',
					'varsIgnorePattern': '^_',
					'ignoreRestSiblings': true,
				},
			],

			// Stylistic
			//'@stylistic/indent': ['error', 'tab'],
			//'@stylistic/semi': ['error', 'always'],
			//'@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
			//'@stylistic/comma-dangle': ['error', 'always-multiline'],
		},
	},
	{
		files: [
			'**/*.svelte',
			'**/*.svelte.ts',
			'**/*.svelte.js',
		],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig,
			},
		},
		rules: {
			// TypeScript
			'@typescript-eslint/no-unused-expressions': 'off',

			// Svelte
			'svelte/no-at-html-tags': 'off',
			'svelte/require-each-key': 'off',
			'svelte/no-navigation-without-resolve': 'off',
		}
	},
);
