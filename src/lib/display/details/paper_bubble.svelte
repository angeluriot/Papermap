<script lang="ts">
	import type { GraphPoint } from '../graph/types';
	import type { Map } from '$lib/types/map';
	import type { Paper } from '$lib/types/paper';
	import Content from '$lib/display/details/paper_content.svelte';
	import type { Journal } from '$lib/types/journal';

	const { point, map, journals, paper, width, height }: {
		point: GraphPoint,
		map: Map,
		journals: { [id: string]: Journal; },
		paper: Paper,
		width: number,
		height: number,
	} = $props();

	const details_width = 32;
	const details_x_margin = 2.2;
	const details_y_margin = 6;
	const details_y_margin_limit = 2.7;
	const arrow_x_margin = 0.5;
	const window_padding = 2;

	const details_x = $derived(point.x + point.focus_size);
	const details_y = $derived(point.y);

	let details_height = $state(0);
	let details: HTMLDivElement | null = $state(null);

	let {
		details_left,
		details_top,
		arrow_left,
		arrow_rotation
	} = $derived.by(() =>
	{
		let result = {
			details_left: `calc(${point.x + point.focus_size}px + ${details_x_margin}em)`,
			details_top: `calc(${point.y}px - ${details_y_margin}em)`,
			arrow_left: `calc(${point.x + point.focus_size}px + ${arrow_x_margin}em)`,
			arrow_rotation: 'rotate(-45deg)',
		};

		if (details === null)
			return result;

		const em = parseFloat(getComputedStyle(details).fontSize);

		if (details_x + (details_x_margin + details_width + window_padding) * em > width)
		{
			result.details_left = `calc(calc(${point.x - point.focus_size}px - ${details_width}em) - ${details_x_margin}em)`;
			result.arrow_left = `calc(${point.x - point.focus_size}px - ${arrow_x_margin}em)`;
			result.arrow_rotation = 'rotate(135deg)';
		}

		const top_overflow = Math.max(0, window_padding * em - (details_y - details_y_margin * em));
		const bottom_overflow = Math.max(0, (details_y - details_y_margin * em + details_height) - (height - window_padding * em));

		if (top_overflow > 0)
			result.details_top = `calc(${point.y}px - ${Math.max(details_y_margin - top_overflow / em, details_y_margin_limit)}em)`;
		if (bottom_overflow > 0)
			result.details_top = `calc(${point.y}px - ${Math.min(details_y_margin + bottom_overflow / em, details_height / em - details_y_margin_limit)}em)`;

		return result;
	});
</script>

<div class="details left-0 top-0 absolute">
	<div
		class="arrow absolute bg-white"
		style="left: {arrow_left}; top: {point.y}px; transform: {arrow_rotation};"
	>
		<div class="hitbox"></div>
	</div>
	<div
		class="details-container absolute bg-white" bind:clientHeight={details_height} bind:this={details}
		style="left: {details_left}; top: {details_top}; width: {details_width}em"
	>
		<Content {map} {journals} {paper}/>
	</div>
</div>

<style>
	.details
	{
		filter: drop-shadow(0 0.1em 1.25em #0c138e36);
	}

	.details-container
	{
		border-radius: 1.5em;
		padding: 1.4em 1.6em 1.6em 1.6em;
	}

	.arrow
	{
		width: 3.2em;
		height: 3.2em;
		border-radius: 0.6em;
		transform-origin: 0 0;
	}

	.hitbox
	{
		position: absolute;
		top: -1em;
		left: -1em;
		width: calc(100% + 2em);
		height: calc(100% + 2em);
		border-radius: 2em;
	}
</style>
