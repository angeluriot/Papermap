<script lang="ts">
	import type { Map } from '$lib/types/map';
	import type { GraphPoint } from './graph/types';
	import { get_overview_by_color } from './overview';
	import { constants as C } from '$lib/utils';

	let { map, group_selected = $bindable(), point_selected = $bindable(), journal_info_open = $bindable() }: {
		map: Map,
		group_selected: { i: number, ids: string[], keep: boolean } | null,
		point_selected: { get_point: () => GraphPoint, keep: boolean } | null,
		journal_info_open: boolean,
	} = $props();

	const overview = get_overview_by_color(map);

	function select_group(event: Event, i: number, ids: string[], clicked: boolean)
	{
		if (C.TOUCH_SCREEN && !clicked)
			return;

		if (!(group_selected !== null && group_selected.keep && !clicked))
			group_selected = { i, ids, keep: clicked };

		if (point_selected !== null && (clicked || !point_selected.keep))
		{
			journal_info_open = false;
			point_selected = null;
		}

		event.stopPropagation();
	}

	function deselect_group(clicked: boolean)
	{
		if (group_selected !== null && (clicked || !group_selected.keep))
			group_selected = null;
	}
</script>

<svelte:window onclick={() => deselect_group(true)}/>

<div class="overview-container text-nowrap relative flex-center-col flex-nowrap">
	<div class="bar-container relative w-full">
		<div class="bar absolute w-full rounded-full overflow-hidden flex flex-row flex-nowrap justify-start items-center">
			{#each overview as data, i}
				<div
					class="h-full cursor-pointer"
					style="background-color: {data.color}; width: {data.width}%; min-width: {data.width}%; opacity: {group_selected === null || group_selected.i == i ? 1 : 0.5};"
				>
				</div>
			{/each}
		</div>
		<div class="bar-hitbox absolute w-full overflow-hidden flex flex-row flex-nowrap justify-start items-center" style="opacity: 0;">
			{#each overview as data, i}
				<div
					class="h-full cursor-pointer" title={data.label.text}
					style="background-color: {data.color}; width: {data.width}%; min-width: {data.width}%; opacity: {group_selected === null || group_selected.i == i ? 1 : 0.5};"
					onclick={(event) => select_group(event, i, data.ids, true)}
					onmouseenter={(event) => select_group(event, i, data.ids, false)}
					onmouseleave={() => deselect_group(false)}
					onkeydown={null} role="button" tabindex={i}
				>
				</div>
			{/each}
		</div>
	</div>
	<div class="w-full flex flex-row flex-nowrap justify-between items-center">
		{#each overview as data, i}
			{#if data.label.opacity !== 0}
				<span
					class="unselectable"
					style="color: {data.color}; opacity: {group_selected === null || group_selected.i == i ? data.label.opacity : data.label.opacity * 0.5};"
				>
					{data.label.text}
				</span>
			{/if}
		{/each}
	</div>
</div>

<style>
	.overview-container
	{
		width: 15em;
		margin-top: 0.3em;
		gap: 0.2em;
	}

	.bar-container
	{
		height: 0.8em;
	}

	.bar
	{
		height: 0.8em;
		box-shadow: 0em 0.1em 1em #00008036;
	}

	.bar-hitbox
	{
		--hitbox: 0.5em;
		margin-top: calc(-1 * var(--hitbox));
		height: calc(0.8em + 2 * var(--hitbox));
	}

	span
	{
		font-family: Satoshi-Variable;
		font-weight: 700;
		text-shadow: 0em 0.1em 0.75em #00008036;
	}
</style>
