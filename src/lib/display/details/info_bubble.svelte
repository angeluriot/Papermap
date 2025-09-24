<script lang="ts">
	import JournalInfo from './journal.svelte';
	import type { Journal } from '$lib/types/journal';

	let { emojis, text, link, journal, width, height }: {
		emojis: Record<string, string>,
		text?: string,
		link?: boolean,
		journal?: Journal,
		width: number,
		height: number,
	} = $props();

	const info_margin = 2.6;
	const arrow_margin = 1.4;
	const info_left_limit = 9.5;
	const window_padding = 3;

	let info_width = $derived(text !== undefined ? Math.round(Math.max(Math.min(5 + text.length * 0.18, 20), link ? 7 : 0)) : 22);
	let info_height = $state(0);
	let info: HTMLDivElement | undefined = $state();

	let {
		info_left,
		info_top,
		arrow_top,
		arrow_rotation,
		hitbox_top,
		info_final_width,
	} = $derived.by(() =>
	{
		width;
		height;

		const result = {
			info_left: `${0}em`,
			info_top: `-${info_margin}em`,
			arrow_top: `-${arrow_margin}em`,
			arrow_rotation: -135,
			hitbox_top: '-2.88em',
			info_final_width: info_width,
		};

		if (info === undefined)
			return result;

		result.info_top = `calc(-${info_margin}em - ${info_height}px)`;

		const em = parseFloat(getComputedStyle(info).fontSize);
		const rect = info.getBoundingClientRect();

		result.info_final_width = Math.min(info_width, width / em - window_padding * 2);

		if (rect.y - info_margin * em - info_height < window_padding * em)
		{
			result.info_top = `${info_margin}em`;
			result.arrow_top = `${arrow_margin}em`;
			result.arrow_rotation = 45;
			result.hitbox_top = '0.88em';
		}

		const left_overflow = Math.max(0, window_padding - (rect.x / em - (result.info_final_width / 2)));
		const right_overflow = Math.max(0, (rect.x / em + result.info_final_width / 2) - (width / em - window_padding));

		if (left_overflow > 0)
			result.info_left = `${Math.min(left_overflow, info_left_limit)}em`;

		if (right_overflow > 0)
			result.info_left = `${-Math.min(right_overflow, info_left_limit)}em`;

		return result;
	});
</script>

<div class="info absolute cursor-auto" bind:this={info}>
	<div
		class="arrow absolute bg-white"
		style="top: {arrow_top}; transform: rotate({arrow_rotation}deg);"
	>
	</div>
	<div
		class="info-container absolute bg-white" bind:clientHeight={info_height}
		style="left: {info_left}; top: {info_top}; padding: {journal ? '1.3em 1.5em 1.1em 1.5em' : '1em 1.2em 1.1em 1.2em'};"
	>
		{#if text !== undefined}
			<span class="text" style="width: {info_final_width}em;">
				{text}{#if link}<br/>(click to open){/if}
			</span>
		{:else if journal !== undefined}
			<div class="journal" style="width: {info_final_width}em;">
				<JournalInfo {emojis} {journal} {width} {height} />
			</div>
		{/if}
	</div>
</div>
{#if journal !== undefined}
	<div class="hitbox" style="top: {hitbox_top};"></div>
{/if}

<style>
	.info
	{
		filter: drop-shadow(0 0.1em 1em #00008036);
		transform: translateZ(0);
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
		font-family: Satoshi-Variable, sans-serif;
		line-height: 1.25em;
		font-weight: 500;
		text-align: center;
	}

	.journal
	{
		display: block;
	}

	.hitbox
	{
		cursor: auto;
		position: absolute;
		transform: translateX(16.667%);
		left: 0em;
		width: 75%;
		height: 2em;
	}
</style>
