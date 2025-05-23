<script lang="ts">
	import type { Map } from '$lib/types/map';
	import Add from '$lib/svgs/add.svg';
	import Submit from '$lib/svgs/submit.svg';
	import Info from '$lib/display/buttons/info.svelte';

	const { map, add, submit }: { map: Map, add: () => void, submit: () => Promise<void> } = $props();

	let nb = $derived(map.papers.filter(paper => paper.edit).length);
</script>

<div class="buttons-container right-0 bottom-0 flex-center-col">
	<div class="relative button-container z-100" onclick={add} onkeydown={null} role="button" tabindex={0}>
		<img src={Add} alt="Add" class="button relative rounded-full img-unselectable"/>
		<Info text="Add a new paper" width={7.5} distance={3.2} />
	</div>
	<div class="relative button-container" onclick={submit} onkeydown={null} role="button" tabindex={1}>
		<img src={Submit} alt="Submit" class="button relative rounded-full img-unselectable z-100"/>
		<Info text="Submit your changes" width={8.5} distance={3.2} y_shift={-0.5} />
		{#if nb}
			<div class="nb absolute right-0 top-0 z-105 flex-center-col rounded-full unselectable">
				<span class="z-105">{nb}</span>
			</div>
		{/if}
	</div>
</div>

<style>
	.buttons-container
	{
		gap: 0.9em;
		margin: 1.5em 1.3em;
	}

	.button-container
	{
		filter: drop-shadow(0em 0.1em 1.4em #00008041);
	}

	.button
	{
		cursor: pointer;
		transition: transform 0.2s ease-in-out;
		width: 3.6em;
		height: 3.6em;
		z-index: 102;
	}

	.button:hover
	{
		transform: scale(1.06);
	}

	.button:active
	{
		transition: none;
		transform: scale(1);
	}

	.button-container
	{
		--info-display: none;
	}

	.button-container:has(.button:hover)
	{
		--info-display: block;
	}

	.nb
	{
		font-family: Satoshi-Variable, sans-serif;
		font-weight: 600;
		color: white;
		background-color: #e42f2f;
		padding: 0.1em 0.5em;
		margin-top: -0.4em;
		margin-right: 0.2em;
		transform: translateX(30%);
		min-width: 1.7em;
	}
</style>
