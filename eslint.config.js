import svelteConfig from './svelte.config.js';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig } from 'eslint/config';
import jsonc from 'eslint-plugin-jsonc';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import svelte from 'eslint-plugin-svelte';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import jsoncParser from 'jsonc-eslint-parser';
import { fileURLToPath } from 'node:url';
import ts from 'typescript-eslint';


const gitignore_path = fileURLToPath(new URL('./.gitignore', import.meta.url));


export default defineConfig(
	includeIgnoreFile(gitignore_path),
	{
		ignores: ['data/journals/**'],
	},
	js.configs.recommended,
	...ts.configs.recommended,
	{
		files: [
			'**/*.ts',
			'**/*.js',
			'**/*.cjs',
			'**/*.mjs',
			'**/*.svelte',
			'**/*.svelte.ts',
			'**/*.svelte.js',
		],
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
		},
		plugins: {
			'@stylistic': stylistic,
			'unused-imports': unusedImports,
			'simple-import-sort': simpleImportSort,
			unicorn: eslintPluginUnicorn,
		},
		rules: {
			// TypeScript
			'no-undef': 'off',
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-vars': ['error', {
				args: 'all',
				argsIgnorePattern: '^_',
				caughtErrors: 'all',
				caughtErrorsIgnorePattern: '^_',
				destructuredArrayIgnorePattern: '^_',
				varsIgnorePattern: '^_',
				ignoreRestSiblings: true,
			}],

			// Stylistic
			'@stylistic/indent': ['error', 'tab'],
			'@stylistic/semi': ['error', 'always'],
			'@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
			'@stylistic/comma-dangle': ['error', 'always-multiline'],
			'@stylistic/object-curly-spacing': ['error', 'always'],
			'@stylistic/array-bracket-spacing': ['error', 'never'],
			'@stylistic/type-annotation-spacing': ['error', {
				before: false,
				after: true,
				overrides: {
					arrow: { before: true, after: true },
				},
			}],
			'@stylistic/linebreak-style': ['error', 'unix'],
			'@stylistic/arrow-spacing': ['error', { before: true, after: true }],
			'@stylistic/space-before-function-paren': ['error', {
				anonymous: 'never', named: 'never', asyncArrow: 'always',
			}],
			'@stylistic/keyword-spacing': 'error',
			'@stylistic/space-infix-ops': 'error',
			'@stylistic/no-multiple-empty-lines': ['error', { max: 2, maxBOF: 0, maxEOF: 0 }],
			'@stylistic/eol-last': ['error', 'always'],
			'@stylistic/no-trailing-spaces': 'error',
			'@stylistic/member-delimiter-style': ['error', {
				multiline: { delimiter: 'comma', requireLast: true },
				singleline: { delimiter: 'comma', requireLast: false },
				overrides: {
					interface: {
						multiline: { delimiter: 'semi', requireLast: true },
						singleline: { delimiter: 'semi', requireLast: false },
					},
				},
			}],
			'@stylistic/type-generic-spacing': 'error',
			'@stylistic/template-curly-spacing': ['error', 'never'],
			'@stylistic/computed-property-spacing': ['error', 'never'],
			'@stylistic/space-in-parens': ['error', 'never'],
			'@stylistic/space-unary-ops': ['error', { words: true, nonwords: false }],
			'@stylistic/no-whitespace-before-property': 'error',
			'@stylistic/brace-style': ['error', 'allman', { allowSingleLine: true }],
			'@stylistic/space-before-blocks': ['error', 'always'],
			'@stylistic/comma-spacing': ['error', { before: false, after: true }],

			// Unused imports
			'unused-imports/no-unused-imports': 'error',

			// Simple import sort
			'simple-import-sort/imports': ['error', { groups: [['^\\u0000', '^']] }],
			'simple-import-sort/exports': 'error',

			// Unicorn
			'unicorn/better-regex': 'error',
			'unicorn/error-message': 'error',
			'unicorn/no-useless-undefined': 'error',
			'unicorn/throw-new-error': 'error',
			'unicorn/prefer-node-protocol': 'error',
			'unicorn/prefer-array-find': 'error',
			'unicorn/prefer-array-flat': 'error',
			'unicorn/prefer-array-flat-map': 'error',
			'unicorn/prefer-array-index-of': 'error',
			'unicorn/prefer-array-some': 'error',
			'unicorn/prefer-string-replace-all': 'error',
			'unicorn/prefer-import-meta-properties': 'error',
			'unicorn/prefer-includes': 'error',
			'unicorn/prefer-string-slice': 'error',
			'unicorn/no-empty-file': 'error',
			'unicorn/prefer-optional-catch-binding': 'error',
		},
	},
	...svelte.configs.recommended,
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

			// Stylistic
			'@stylistic/indent': 'off',

			// Svelte
			'svelte/no-at-html-tags': 'off',
			'svelte/require-each-key': 'off',
			'svelte/no-navigation-without-resolve': 'off',
			'svelte/indent': ['error', { indent: 'tab', switchCase: 1 }],
			'svelte/prefer-const': 'error',
		},
	},
	...jsonc.configs['flat/recommended-with-json'],
	{
		files: ['**/*.json'],
		languageOptions: {
			parser: jsoncParser,
		},
		plugins: {
			jsonc,
		},
		rules: {
			// JSONC
			'jsonc/indent': ['error', 'tab'],
			'jsonc/quotes': ['error', 'double'],
		},
	},
);
