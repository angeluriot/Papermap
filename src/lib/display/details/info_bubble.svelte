<script lang="ts">
	import type { Paper } from '$lib/types/paper';
	import Content from '$lib/display/details/paper_content.svelte';
	import type { Journal } from '$lib/types/journal';

	const { text, journal, width, height }: {
		text?: string,
		journal?: Journal,
		width: number,
		height: number
	} = $props();

	const info_width = 20;
	const info_x_margin = 2.2;
	const info_y_margin = 6;
	const info_y_margin_limit = 2.7;
	const arrow_x_margin = 0.5;
	const window_padding = 2;

	const info_x = $derived(0);
	const info_y = $derived(0);

	let info_height = $state(0);
	let info: HTMLDivElement | null = $state(null);

	let info_left = 0
	let info_top = 0
	let arrow_left = 0
	let arrow_rotation = 0
	/*let {
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
	});*/
</script>

<div class="info left-0 top-0 absolute unselectable">
	<div
		class="arrow absolute bg-white"
		style="left: {info_left}; top: {0}px; transform: {arrow_rotation};"
	>
		<div class="hitbox"></div>
	</div>
	<div
		class="info-container absolute bg-white" bind:clientHeight={info_height} bind:this={info}
		style="left: {info_left}; top: {info_top}; width: {info_width}em"
	>
		<span>{text}</span>
	</div>
</div>

<style>
	.info
	{
		filter: drop-shadow(0 0.1em 1.25em #0c138e36);
		pointer-events: none;
	}

	.info-container
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
