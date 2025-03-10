<script lang="ts">
	import type { Map, Maps } from "$lib/types/map";

	const { map, maps }: { map: Map, maps: Maps } = $props();

	let div: HTMLDivElement | null = $state(null);
	let search = $state(map.question);
</script>

<div class="input-container unselectable bg-white rounded-full text-nowrap inline-block align-middle overflow-hidden relative" bind:this={div}>
	<span class="emoji inline-block align-middle">{map.emoji}</span>
	<div class="relative inline-block align-middle">
		<span class="bone opacity-0 h-full">{map.question}</span>
		<input
			type="text" spellcheck="false" class="selectable absolute left-0 w-full"
			placeholder={map.question} bind:value={search}
		/>
	</div>
	<div class="mask bg-white absolute h-full right-0 top-0 unselectable"></div>
</div>

<style>
	.input-container
	{
		--x-pad: 1.6em;
		--y-pad: 1em;
		--margin: 1.5em;
		font-size: clamp(12px, calc(calc(0.16vw + 5.5px) * 2), 17.5px);
		box-shadow: 0em 0.1em 1.25em #0c138e36;
		margin: var(--margin);
		max-width: calc(100vw - calc(2 * var(--margin)));
		font-family: Satoshi-Variable;
		font-weight: 575;
	}

	@media screen and (max-width: 800px)
	{
		.input-container
		{
			--x-pad: 1.2em;
			--y-pad: 0.7em;
		}
	}

	.emoji
	{
		margin-right: calc(-1.7 * var(--x-pad));
		padding: var(--y-pad) calc(0.9 * var(--x-pad));
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
		width: var(--x-pad);
	}
</style>
