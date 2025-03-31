<script lang="ts">
	import type { Journal } from '$lib/types/journal';

	let { text, journal, width, height }: {
		text?: string,
		journal?: Journal,
		width: number,
		height: number
	} = $props();

	const info_top_margin = 3;
	const arrow_top_margin = 1.8;
	const info_bottom_margin = 1.7;
	const arrow_bottom_margin = 0.5;
	const info_left_limit = 9.5;
	const window_padding = 2;

	let info_width = $derived(text ? Math.round(Math.min(5 + text.length * 0.15, 20)) : 20);
	let info_height = $state(0);
	let info: HTMLDivElement | undefined = $state(undefined);

	let {
		info_left,
		info_top,
		arrow_top,
		arrow_rotation
	} = $derived.by(() =>
	{
		width;
		height;

		let result = {
			info_left: `${0}em`,
			info_top: `-${info_top_margin}em`,
			arrow_top: `-${arrow_top_margin}em`,
			arrow_rotation: -135,
		};

		if (info === undefined)
			return result;

		result.info_top = `calc(-${info_top_margin}em - ${info_height}px)`;

		const em = parseFloat(getComputedStyle(info).fontSize);
		const rect = info.getBoundingClientRect();

		if (rect.y - info_top_margin * em - info_height < window_padding * em)
		{
			result.info_top = `${info_bottom_margin}em`;
			result.arrow_top = `${arrow_bottom_margin}em`;
			result.arrow_rotation = 45;
		}

		const left_overflow = Math.max(0, window_padding - (rect.x / em - (info_width / 2)));
		const right_overflow = Math.max(0, (rect.x / em + info_width / 2) - (width / em - window_padding));

		if (left_overflow > 0)
			result.info_left = `${Math.min(left_overflow, info_left_limit)}em`;

		if (right_overflow > 0)
			result.info_left = `${-Math.min(right_overflow, info_left_limit)}em`;

		return result;
	});
</script>

<div class="info absolute unselectable" bind:this={info}>
	<div
		class="arrow absolute bg-white"
		style="top: {arrow_top}; transform: rotate({arrow_rotation}deg);"
	>
	</div>
	<div
		class="info-container absolute bg-white" bind:clientHeight={info_height}
		style="left: {info_left}; top: {info_top};"
	>
		<span class="text" style="width: {info_width}em;">
			{text}
		</span>
	</div>
</div>

<style>
	.info
	{
		filter: drop-shadow(0 0.1em 1em #0c138e36);
		pointer-events: none;
		z-index: 1000;
		left: 50%;
	}

	.info-container
	{
		border-radius: 1em;
		padding: 1em 1.2em 1.1em 1.2em;
		transform: translateX(-50%);
	}

	.arrow
	{
		width: 2.5em;
		height: 2.5em;
		border-radius: 0.4em;
		transform-origin: 0 0;
	}

	.text
	{
		display: block;
		font-family: Satoshi-Variable;
		line-height: 1.25em;
		font-weight: 500;
		text-align: center;
	}
</style>
