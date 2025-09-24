<script lang="ts">
	import type { GraphPoint } from './graph/types';
	import { get_overview } from './overview';
	import type { Map } from '$lib/types/map';
	import { constants as C } from '$lib/utils';

	let { map, group_selected = $bindable(), point_selected = $bindable(), journal_info_open = $bindable(), input_selected = $bindable() }: {
		map: Map,
		group_selected: { i: number, ids: string[], keep: boolean } | null,
		point_selected: { get_point: () => GraphPoint, keep: boolean } | null,
		journal_info_open: boolean,
		input_selected: boolean,
	} = $props();

	const overview = get_overview(map);
	const labels_2_lines = overview.some(data => data.label.type !== null && data.label.text.length > 1);
	const nb_labels = overview.reduce((acc, data) => acc + (data.label.type !== null ? 1 : 0), 0);
	const other_label_elements: HTMLSpanElement[] = $state([]);
	let container_element: HTMLDivElement | undefined = $state();

	let positions = $derived.by(() =>
	{
		if (!container_element || other_label_elements.length === 0)
			return other_label_elements.map(() => {});

		const container_width = container_element.offsetWidth;

		return overview.map((data, i) =>
		{
			if (data.label.type !== null)
				return;

			const element = other_label_elements[i];

			if (!element)
				return { position: data.x + data.width / 2, align: 'center' };

			const ideal_center = (data.x + data.width / 2) * container_width / 100;
			const half_width = element.offsetWidth / 2;
			const center = Math.max(half_width, Math.min(container_width - half_width, ideal_center));
			let align = 'center';

			if (ideal_center <= half_width)
				align = 'left';
			else if (ideal_center >= container_width - half_width)
				align = 'right';

			return {
				position: (center / container_width) * 100,
				align,
			};
		});
	});

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

		if (clicked)
			input_selected = false;

		event.stopPropagation();
	}

	function deselect_group(clicked: boolean)
	{
		if (group_selected !== null && (clicked || !group_selected.keep))
			group_selected = null;
	}
</script>

<svelte:window onclick={() => deselect_group(true)}/>

<div class="overview-container text-nowrap relative flex-center-col flex-nowrap z-90 selectable" bind:this={container_element}>
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
					class="h-full cursor-pointer"
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
	<div class="labels w-full flex flex-row flex-nowrap justify-between items-start">
		{#each overview as data, i}
			{#if data.label.type !== null}
				<span
					class="text-{data.label.type}"
					style="color: {data.color}; opacity: {nb_labels !== 1 && (group_selected === null || group_selected.i == i) ? 1 : 0};"
				>
					{data.label.text.join('\n')}
				</span>
			{/if}
		{/each}
	</div>
	<div class="other-labels w-full absolute">
		{#each overview as data, i}
			{#if data.label.type === null || nb_labels === 1}
				<span
					class="absolute"
					style="left: {positions[i]?.position || data.x + data.width / 2}%; color: {data.color}; opacity: {(nb_labels === 1 && data.label.type !== null) || (group_selected !== null && group_selected.i == i) ? 1 : 0}; margin-top: {labels_2_lines ? '-0.6' : '0'}em; text-align: {positions[i]?.align || 'center'};"
					bind:this={other_label_elements[i]}
				>
					{#each data.label.text as list}
						{list}<br/>
					{/each}
				</span>
			{/if}
		{/each}
	</div>
</div>

<style>
	.overview-container
	{
		min-width: 12em;
		width: 15em;
		max-width: calc(100vw - 3em);
		margin-top: 0.45em;
		gap: 0.35em;
	}

	@media screen and (max-width: 600px)
	{
		.overview-container
		{
			min-width: 0em;
			margin-top: 0.1em;
		}
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

	.labels
	{
		gap: 1em;
		white-space: pre-line;
	}

	span
	{
		font-size: 0.95em;
		text-wrap: nowrap;
		font-family: Satoshi-Variable, sans-serif;
		font-weight: 700;
		text-shadow: 0em 0.1em 0.75em #00008036;
		line-height: 1.2em;
	}

	.text-left
	{
		text-align: left;
	}

	.text-right
	{
		text-align: right;
	}

	.other-labels span
	{
		margin-top: -0.6em;
		transform: translateX(-50%);
	}
</style>
