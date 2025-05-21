<script lang="ts">
	import Search from '$lib/home/search.svelte';
	import type { Map, MapTitle } from '$lib/types/map';
	import { onMount } from 'svelte';

	let { emojis, map, maps, width, height, input_selected = $bindable() }: {
		emojis: Record<string, string>,
		map: Map,
		maps: MapTitle[],
		width: number,
		height: number,
		input_selected: boolean,
	} = $props();

	let search = $state('');
	let search_element: Search | undefined = $state(undefined);
	let input_element: HTMLInputElement | undefined = $state(undefined);
	let canvas: HTMLCanvasElement | undefined = $state(undefined);
	let reload = $state({});

	let input_width = $derived.by(() =>
	{
		reload;

		if (!canvas || !input_element)
			return;

		width;
		height;
		const ctx = canvas.getContext('2d');

		if (!ctx)
			return;

		const style = getComputedStyle(input_element);
		ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
		ctx.letterSpacing = style.letterSpacing;

		const text_width = ctx.measureText(map.question.long).width;

		const pl = parseFloat(style.paddingLeft);
		const pr = parseFloat(style.paddingRight);

		return `${Math.ceil(text_width + pl + pr)}px`;
	});

	function select_input(event: Event)
	{
		input_selected = true;
		event.stopPropagation();
	}

	function deselect_input()
	{
		input_selected = false;
	}

	$effect(() =>
	{
		if (input_selected)
			search_element?.select();
		else
			search_element?.deselect();
	});

	function to_new_map(title: string)
	{
		const clean_title = encodeURIComponent(title.trim());

		if (clean_title.length > 0)
		{
			window.location.href = `/?request&title=${clean_title}`;
			return;
		}

		window.location.href = '/?request';
	}

	onMount(() =>
	{
		setTimeout(() => reload = {}, 100);
		setTimeout(() => reload = {}, 1000);
		setTimeout(() => reload = {}, 2000);
		setTimeout(() => reload = {}, 5000);
	});
</script>

<svelte:window onclick={deselect_input}/>

<canvas style="display: none;" bind:this={canvas}></canvas>
<div
	class="input-container relative"
	onclick={select_input}
	onkeydown={null} role="button" tabindex={0}
>
	<div class="emoji absolute unselectable z-10">{@html emojis[map.emoji]}</div>
	<input
		type="text" spellcheck="false" class="rounded-full relative"
		placeholder={map.question.long} bind:value={search} bind:this={input_element}
		style="width: {input_width}; {search_element?.shown() ? 'border-radius: 1.575em 1.575em 0em 0em;' : 'border-radius: 1.575em;'}"
	/>
	<div class="search absolute w-full bg-white" style="display: {search_element?.shown() ? 'block' : 'none'};">
		<Search {emojis} {maps} {search} new_map={to_new_map} bind:this={search_element}/>
	</div>
</div>

<style>
	.input-container
	{
		font-family: Satoshi-Variable, sans-serif;
		line-height: 1.5em;
	}

	.emoji
	{
		width: 1.2em;
		height: 1.2em;
		top: calc(50% - 0.02em);
		left: 1.35em;
		transform: translateY(-50%);
	}

	.search
	{
		font-size: 0.95em;
		padding: 0em 0em 0.4em 0em;
		left: 0em;
		top: 3em;
		border-radius: 0em 0em 1.6em 1.6em;
		overflow: hidden;
	}

	input
	{
		max-width: calc(100vw - calc(2 * 1.5em + 12em + 1.5em + 3.15em + 0.65em));
		padding: 0.85em 1.45em 0.8em 3.15em;
		font-weight: 575;
		letter-spacing: 0.005em;
		background-color: white;
	}

	input::placeholder
	{
		color: black;
	}

	input:focus::placeholder
	{
		color: #b4b3bf;
	}

	@media screen and (max-width: 600px)
	{
		input
		{
			min-width: calc(100vw - calc(2 * 1.5em + 3.15em + 0.65em));
			max-width: calc(100vw - calc(2 * 1.5em + 3.15em + 0.65em));
		}

		.input-container:hover input
		{
			min-width: calc(100vw - calc(2 * 1.5em));
			max-width: calc(100vw - calc(2 * 1.5em));
		}
	}
</style>
