<script lang="ts">
	import Self from './maps.svelte';
	import Arrow from '$lib/svgs/arrow.svg';
	import type { GroupNode } from '$lib/types/map';
	import { cubicInOut } from 'svelte/easing';

	const { emojis, node }: {
		emojis: Record<string, string>,
		node: GroupNode,
	} = $props();

	let open = $state(false);

	function my_animation(node: HTMLElement)
	{
		const width = node.clientWidth + 1;
		const height = node.clientHeight + 1;

		return {
			duration: 250,
			css: (t: number) =>
			{
				const width_eased = cubicInOut(Math.max(0, Math.min(1, t * 3)));
				const height_eased = cubicInOut(Math.max(0, Math.min(1, t * 1.1 - 0.1)));

				return `
					width: ${width_eased * width}px;
					height: ${height_eased * height}px;
					pointer-events: none;
				`;
			},
		};
	}
</script>

<div
	class="node flex flex-col justify-start items-start relative"
	onclick={(event: Event) => { open = !open; event.stopPropagation(); }} onkeydown={null} role="button" tabindex={0}
>
	<div class="group flex-center-row unselectable" style="padding-bottom: {open ? '0.5em' : '0em'};">
		<img src={Arrow} alt="Toggle" class="arrow unselectable" style="transform: {open ? 'rotate(90deg)' : 'rotate(0deg)'}" />
		<div class="emoji unselectable">{@html emojis[node.emoji]}</div>
		<h2 class="unselectable">{node.name}</h2>
	</div>
	{#if open}
		<div class="list overflow-hidden" transition:my_animation>
			<div class="maps flex flex-col justify-start items-start flex-wrap">
				{#each node.maps as map}
					<a class="map" href={map.url} onclick={(event: Event) => event.stopPropagation()}>
						<div class="unselectable flex">
							<div class="unselectable emoji">{@html emojis[map.emoji]}</div>
							<span class="unselectable">{map.question.short}</span>
						</div>
					</a>
				{/each}
			</div>
			{#each node.sub_groups as sub_group}
				<Self {emojis} node={sub_group}/>
			{/each}
		</div>
	{/if}
</div>

<style>
	.node
	{
		padding: 0.7em 1.2em 0.7em 0.9em;
		border-radius: 1em;
		width: fit-content;
	}

	.node:hover:not(:has(*:hover))
	{
		background-color: #00004916;
	}

	.group
	{
		font-size: 1.3em;
		gap: 0.3em;
		transition: padding-bottom 0.25s ease-in-out;
	}

	.arrow
	{
		width: 0.9em;
		height: 0.9em;
		min-width: 0.9em;
		min-height: 0.9em;
		transition: transform 0.25s ease-in-out;
	}

	.emoji
	{
		width: 1.15em;
		height: 1.15em;
		min-width: 1.15em;
		min-height: 1.15em;
	}

	h2
	{
		display: block;
		font-family: Satoshi-Variable, sans-serif;
		font-weight: 625;
		line-height: 1.25em;
		text-wrap: wrap;
		color: #303037;
	}

	.list
	{
		margin-left: 0.8em;
	}

	.map
	{
		padding: 0.7em 1em;
		border-radius: 1em;
	}

	.map:hover
	{
		background-color: #00004916;
	}

	.map .emoji
	{
		margin-bottom: -1.15em;
	}

	.map span
	{
		display: block;
		width: var(--thumbnail-width);
		font-family: Satoshi-Variable, sans-serif;
		font-weight: 550;
		line-height: 1.25em;
		text-wrap: wrap;
		color: #303037;
	}

	.map > .unselectable
	{
		gap: 0.3em;
	}
</style>
