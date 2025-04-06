<script lang="ts">
	import type { Map, Maps } from '$lib/types/map';
	import { emoji_to_svg } from './emojis';

	const { map, maps }: { map: Map, maps: Maps } = $props();

	let div: HTMLDivElement | null = $state(null);
	let search = $state(map.question.long);
</script>

<div
	class="input-container unselectable bg-white rounded-full text-nowrap inline-block align-middle overflow-hidden relative"
	bind:this={div} onscroll={(e: Event) => { (e.currentTarget as HTMLDivElement).scrollLeft = 0; }}
>
	<img src={emoji_to_svg(map.emoji)} alt={map.emoji} class="emoji inline-block align-middle"/>
	<div class="relative inline-block align-middle">
		<span class="bone opacity-0 h-full">{map.question.long}</span>
		<input
			type="text" spellcheck="false" class="selectable absolute left-0 w-full"
			placeholder={map.question.long} bind:value={search}
		/>
	</div>
	<div class="mask bg-white absolute h-full right-0 top-0 unselectable"></div>
</div>

<style>
	.input-container
	{
		box-shadow: 0em 0.1em 1.25em #00008036;
		font-family: Satoshi-Variable;
		font-weight: 575;
		line-height: 1.5em;
	}

	.emoji
	{
		margin-right: calc(-1.7 * var(--x-pad));
		padding: var(--y-pad) calc(0.9 * var(--x-pad));
		height: calc(1em + calc(var(--y-pad) * 2));
	}

	.bone
	{
		padding: 0em var(--x-pad);
	}

	input
	{
		top: calc(-1 * var(--y-pad));
		padding: calc(1.04 * var(--y-pad)) var(--x-pad) calc(0.96 * var(--y-pad)) var(--x-pad);
	}

	.mask
	{
		margin-right: calc(-1 * var(--x-pad));
		width: calc(var(--x-pad) * 2);
	}
</style>
