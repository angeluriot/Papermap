<script lang="ts">
	import type { MapTitle } from '$lib/types/map';
	import Fuse from 'fuse.js';
	import { Document, Charset } from 'flexsearch';
	import { emoji_to_svg } from '$lib/display/emojis';

	let { maps, search }: { maps: MapTitle[], search: string } = $props();

	let search_selected = $state(false);
	let selected_i: number | null = $state(null);

	export function select()
	{
		if (!search_selected)
		{
			search_selected = true;
			selected_i = null;
		}
	}

	export function deselect()
	{
		if (search_selected)
		{
			search_selected = false;
			selected_i = null;
		}
	}

	const index = new Document({
		tokenize: 'forward',
		encoder: Charset.LatinBalance,
		cache: true,
		document: {
			id: 'id',
			index: 'content',
		},
	});

	for (let i = 0; i < maps.length; i++)
	{
		index.add({
			id: i,
			content: maps[i].question.short,
		});
	}

	const fuse_options = {
		isCaseSensitive: false,
		ignoreDiacritics: true,
		includeScore: false,
		includeMatches: false,
		minMatchCharLength: 1,
		shouldSort: true,
		findAllMatches: true,
		keys: [
			{ name: 'group.name', weight: 1 },
			{ name: 'question.short', weight: 3 },
			{ name: 'question.long', weight: 2 },
			{ name: 'description', weight: 1 },
			{ name: 'tags', weight: 1 },
		],
	};

	const fuse = new Fuse(maps, fuse_options);
	const max_results = 10;

	const results = $derived.by(() =>
	{
		if (search.trim() === '')
			return [];

		let temp = index.search(search, { limit: max_results * 2, resolve: true }) as any;
		const nothing = temp === undefined || temp.length === 0 || temp[0].result === undefined

		let flex_res = nothing ? [] : temp[0].result.map((i: number) => maps[i]) as MapTitle[];
		let fuse_res = fuse.search(search).map((result) => result.item).slice(0, max_results * 2);
		let res: Record<string, { map: MapTitle, score: number }> = {};

		for (let i = 0; i < flex_res.length; i++)
		{
			const id = flex_res[i].group.id + flex_res[i].id;
			res[id] = { map: flex_res[i], score: flex_res.length - i };
		}

		for (let i = 0; i < fuse_res.length; i++)
		{
			const id = fuse_res[i].group.id + fuse_res[i].id;

			if (res[id] === undefined)
				res[id] = { map: fuse_res[i], score: flex_res.length - i };
			else
				res[id].score += flex_res.length - i;
		}

		let sorted = Object.values(res).sort((a, b) => b.score - a.score);
		return sorted.map((i) => i.map).slice(0, max_results);
	});

	export function shown(): boolean
	{
		return search_selected && results.length > 0;
	}

	export function handle_key_press(event: KeyboardEvent)
	{
		if (shown())
		{
			if (event.key === 'ArrowDown')
			{
				selected_i = selected_i === null ? 0 : (selected_i + 1) % results.length;
				event.preventDefault();
			}

			else if (event.key === 'ArrowUp')
			{
				selected_i = selected_i === null ? results.length - 1 : (selected_i - 1 + results.length) % results.length;
				event.preventDefault();
			}

			else if (event.key === 'Enter')
			{
				window.location.href = results[selected_i === null ? 0 : selected_i].url;
				event.preventDefault();
			}
		}
	}
</script>

<svelte:window onkeydown={handle_key_press}/>

<div class="search flex flex-col justify-center items-start">
	{#each results as result, i}
		<a href={result.url} class="w-full">
			<div
				class="result w-full flex flex-row justify-start items-center"
				style="{i === selected_i ? 'background-color: #eeeff7;' : ''}"
				onmouseenter="{() => selected_i = i}" role="button" tabindex={i}
			>
				<img src={emoji_to_svg(result.emoji)} alt={result.emoji}/>
				<span class="unselectable">{result.question.short}</span>
			</div>
		</a>
	{/each}
</div>

<style>
	.result
	{
		padding: 0.35em 1.3em;
		gap: 0.55em;
	}

	img
	{
		width: 1.1em;
		height: 1.1em;
	}

	span
	{
		font-family: Satoshi-Variable;
		font-weight: 550;
		line-height: 1.5em;
		letter-spacing: 0.005em;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
</style>
