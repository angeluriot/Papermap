<script lang="ts">
	import type { GraphPoint } from '../graph/types';
	import type { Map } from '$lib/types/map';
	import type { Paper } from '$lib/types/paper';
	import Content from '$lib/display/details/paper_content.svelte';
	import type { Journal } from '$lib/types/journal';

	let { point, map, journals, paper, width, height, journal_info_open = $bindable() }: {
		point: GraphPoint,
		map: Map,
		journals: { [id: string]: Journal; },
		paper: Paper,
		width: number,
		height: number,
		journal_info_open: boolean,
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
		arrow_rotation,
		mobile_mode,
	} = $derived.by(() =>
	{
		let result = {
			details_left: `calc(${details_x}px + ${details_x_margin}em)`,
			details_top: `calc(${point.y}px - ${details_y_margin}em)`,
			arrow_left: `calc(${details_x}px + ${arrow_x_margin}em)`,
			arrow_rotation: 'rotate(-45deg)',
			mobile_mode: false,
		};

		if (details === null)
			return result;

		const em = parseFloat(getComputedStyle(details).fontSize);

		if (details_x + (details_x_margin + details_width + window_padding) * em > width)
		{
			if (point.x - point.focus_size - (details_x_margin + details_width + window_padding) * em < 0)
			{
				result.mobile_mode = true;
				return result;
			}

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

<div
	class="details left-0 absolute {mobile_mode ? 'mobile-shadow' : ''}"
	style="{mobile_mode ?  `bottom: ${details_height}px; width: 100%;` : 'top: 0em;'}"
>
	<div
		class="arrow absolute bg-white"
		style="{mobile_mode ? 'display: none;' : ''} left: {arrow_left}; top: {point.y}px; transform: {arrow_rotation};"
	>
		<div class="hitbox"></div>
	</div>
	<div
		class="details-container absolute bg-white {mobile_mode ? 'mobile-radius' : ''}" bind:clientHeight={details_height} bind:this={details}
		style="{mobile_mode ? `--details-width: ${width}px;` : `left: ${details_left}; top: ${details_top}; --details-width: ${details_width}em;`}"
	>
		<Content {map} {journals} {paper} {width} {height} bind:journal_info_open={journal_info_open}/>
	</div>
</div>

<style>
	.details
	{
		filter: drop-shadow(0 0.1em 1.25em #00008036);
		z-index: 100;
	}

	.details.mobile-shadow
	{
		filter: drop-shadow(0 0em 15em #00022d);
	}

	.details-container
	{
		border-radius: 1.5em;
		--details-x-pad: 1.6em;
		width: var(--details-width);
		padding: 1.4em var(--details-x-pad) 1.6em var(--details-x-pad);
	}

	.details-container.mobile-radius
	{
		border-radius: 1.5em 1.5em 0 0;
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
