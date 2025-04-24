<script lang="ts">
	import Search from '$lib/home/search.svelte';
	import type { Map, MapTitle } from '$lib/types/map';
	import { emoji_to_svg } from './emojis';

	let { map, maps, width, height, input_selected = $bindable() }: {
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

	let input_width = $derived.by(() =>
	{
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
</script>

<svelte:window onclick={deselect_input}/>

<canvas style="display: none;" bind:this={canvas}></canvas>
<div
	class="input-container relative"
	onclick={select_input}
	onkeydown={null} role="button" tabindex={0}
>
	<img src={emoji_to_svg(map.emoji)} alt={map.emoji} class="emoji absolute unselectable z-10"/>
	<input
		type="text" spellcheck="false" class="rounded-full relative"
		placeholder={map.question.long} bind:value={search} bind:this={input_element}
		style="width: {input_width}; {search_element?.shown() ? 'border-radius: 1.575em 1.575em 0em 0em;' : 'border-radius: 1.575em;'}"
	/>
	<div class="search absolute w-full bg-white" style="display: {search_element?.shown() ? 'block' : 'none'};">
		<Search maps={maps} {search} new_map={to_new_map} bind:this={search_element}/>
	</div>
</div>

<style>
	.input-container
	{
		font-family: Satoshi-Variable;
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
			max-width: calc(100vw - calc(2 * 1.5em + 3.15em + 0.65em));
		}
	}
</style>
