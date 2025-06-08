<script lang="ts">
	import type { MapTitle } from '$lib/types/map';
	import Fuse from 'fuse.js';
	import { Document, Charset } from 'flexsearch';
	import { get_random_elements, in_browser } from '$lib/utils';
	import { onMount } from 'svelte';

	let { emojis, maps, search, new_map }: {
		emojis: Record<string, string>,
		maps: MapTitle[],
		search: string,
		new_map: (title: string) => void
	} = $props();

	let search_selected = $state(false);
	let selected_i: number | null = $state(null);
	let mounted = $state(false);

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

	$effect(() =>
	{
		search;

		if (search_selected)
			selected_i = null;
	});

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
		if (!in_browser() || !mounted)
			return [];

		if (search.trim() === '')
			return (get_random_elements(maps, max_results) as (MapTitle | 'all' | 'new')[]).concat(['all']);

		let temp = index.search(search, { limit: max_results * 2, resolve: true }) as any;
		const nothing = temp === undefined || temp.length === 0 || temp[0].result === undefined

		let flex_res = nothing ? [] : temp[0].result.map((i: number) => maps[i]) as MapTitle[];
		let fuse_res = fuse.search(search).map((result) => result.item).slice(0, max_results * 2);
		let res: Record<string, { map: MapTitle, score: number }> = {};

		for (let i = 0; i < flex_res.length; i++)
			res[flex_res[i].id] = { map: flex_res[i], score: flex_res.length - i };

		for (let i = 0; i < fuse_res.length; i++)
		{
			const id = fuse_res[i].id;

			if (res[id] === undefined)
				res[id] = { map: fuse_res[i], score: flex_res.length - i };
			else
				res[id].score += flex_res.length - i;
		}

		let sorted = Object.values(res).sort((a, b) => b.score - a.score);
		let final: (MapTitle | 'all' | 'new')[] = sorted.map((i) => i.map).slice(0, max_results);

		if (final.length === 0)
			return ['new'] as 'new'[];

		return final.concat(['all']);
	});

	export function shown(): boolean
	{
		return search_selected && results.length > 0;
	}

	function handle_key_press(event: KeyboardEvent)
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
				const selected = results[selected_i === null ? 0 : selected_i];

				if (selected === 'all')
					window.location.href = '/maps';

				else if (selected === 'new')
					new_map(search);

				else
					window.location.href = selected.url;

				event.preventDefault();
			}
		}
	}

	onMount(() =>
	{
		mounted = true;
	});
</script>

<svelte:window onkeydown={handle_key_press}/>

<div class="flex flex-col justify-center items-start">
	{#each results as result, i}
		{#if result === 'all'}
			<a href={'/maps'} class="w-full">
				<div
					class="result end-result w-full flex flex-row justify-center items-center"
					style="{i === selected_i ? 'background-color: #eeeff7;' : ''}"
					onmouseenter="{() => selected_i = i}" role="button" tabindex={i}
				>
					<span class="unselectable">See more</span>
				</div>
			</a>
		{:else if result == 'new'}
			<div
				class="result end-result w-full flex flex-row justify-center items-center"
				style="{i === selected_i ? 'background-color: #eeeff7;' : ''}"
				onmouseenter="{() => selected_i = i}" role="button" tabindex={i}
				onclick={() => new_map(search)} onkeydown={null}
			>
				<span class="unselectable">Request this map</span>
			</div>
		{:else}
			<a href={result.url} class="w-full">
				<div
					class="result w-full flex flex-row justify-start items-center"
					style="{i === selected_i ? 'background-color: #eeeff7;' : ''}"
					onmouseenter="{() => selected_i = i}" role="button" tabindex={i}
				>
					<div class="emoji">{@html emojis[result.emoji]}</div>
					<span class="unselectable">{result.question.short}</span>
				</div>
			</a>
		{/if}
	{/each}
</div>

<style>
	.result
	{
		padding: 0.35em 1.3em;
		gap: 0.55em;
		cursor: pointer;
	}

	.end-result
	{
		color: #838597;
	}

	.emoji
	{
		width: 1.1em;
		height: 1.1em;
	}

	span
	{
		font-family: Satoshi-Variable, sans-serif;
		font-weight: 500;
		line-height: 1.5em;
		letter-spacing: 0.005em;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
</style>
