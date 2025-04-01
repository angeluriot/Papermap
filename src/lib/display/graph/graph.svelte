<script lang="ts">
	import type { Map } from '$lib/types/map';
	import * as bg from './background';
	import * as pt from './points';
	import type { GraphPoint } from './types';
	import { get_stats } from './utils';

	let { map, width, height, point_selected = $bindable(), group_selected = $bindable(), journal_info_open = $bindable(), details_element }: {
		map: Map,
		width: number,
		height: number,
		point_selected: { get_point: () => GraphPoint, keep: boolean } | null,
		group_selected: { i: number, ids: string[], keep: boolean } | null,
		journal_info_open: boolean,
		details_element: HTMLDivElement | null,
	} = $props();

	const POINT_HITBOX_EXTENSION = 3;

	const stats = $derived(get_stats(map, width, height));
	const x_axis = $derived(bg.get_x_axis(stats));
	const y_axis = $derived(bg.get_y_axis(stats, x_axis));
	const x_title = $derived(bg.get_x_title(stats));
	const y_title = $derived(bg.get_y_title(stats, y_axis));
	const background_points = $derived(bg.get_background_points(x_axis, y_axis, stats));
	const points = $derived(pt.get_graph_points(map, stats));

	function select_point(event: Event, i: number, clicked: boolean)
	{
		if (!(point_selected !== null && point_selected.keep && !clicked))
			point_selected = { get_point: () => points[i], keep: clicked };

		if (group_selected !== null && (clicked || !group_selected.keep))
			group_selected = null;

		if (clicked)
			journal_info_open = false;

		event.stopPropagation();
	}

	function deselect_point(clicked: boolean)
	{
		if (details_element?.matches(':hover'))
			return;

		if (point_selected !== null && (clicked || !point_selected.keep))
		{
			journal_info_open = false;
			point_selected = null;
		}
	}
</script>

<svelte:window onclick={() => deselect_point(true)}/>

<svg viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">
	<g class="background unselectable">
		<rect x=0 y=0 width={width} height={height} fill={bg.BACKGROUND_COLOR}/>
		<g class="points">
			{#each background_points as point}
				<circle cx={point.x} cy={point.y} r={point.size} fill={bg.POINTS_COLOR} opacity={bg.POINTS_OPACITY}/>
			{/each}
		</g>
		<g class="x-axis">
			{#each x_axis as tick}
				{#if tick.type !== null}
					<line
						x1={tick.start.x} y1={tick.start.y} x2={tick.end.x} y2={tick.end.y} stroke={bg.AXIS_COLOR}
						stroke-width={tick.width} stroke-linecap="round" stroke-linejoin="round" opacity={tick.opacity}
					/>
				{/if}
				{#if tick.label !== null}
					<text
						x={tick.label.x} y={tick.label.y}
						fill={bg.AXIS_COLOR} font-family="Satoshi-Bold" font-size={tick.label.font_size}
						text-anchor="middle" alignment-baseline="auto" dominant-baseline="auto"
					>
						{tick.label.text}
					</text>
				{/if}
			{/each}
			<text
				x={x_title.x} y={x_title.y}
				fill={bg.AXIS_COLOR} font-family="Satoshi-Bold" font-size={x_title.font_size}
				text-anchor="middle" alignment-baseline="auto" dominant-baseline="auto"
			>
				{x_title.text}
			</text>
		</g>
		<g class="y-axis">
			{#each y_axis as tick}
				{#if tick.type !== null}
					<line
						x1={tick.start.x} y1={tick.start.y} x2={tick.end.x} y2={tick.end.y} stroke={bg.AXIS_COLOR}
						stroke-width={tick.width} stroke-linecap="round" stroke-linejoin="round" opacity={tick.opacity}
					/>
				{/if}
				{#if tick.label !== null}
					<text
						x={tick.label.x} y={tick.label.y}
						fill={bg.AXIS_COLOR} font-family="Satoshi-Bold" font-size={tick.label.font_size}
						text-anchor="start" alignment-baseline="central" dominant-baseline="central"
					>
						{tick.label.text}
					</text>
				{/if}
			{/each}
			<text
				x={y_title.x} y={y_title.y}
				transform="rotate(90, {y_title.x}, {y_title.y})"
				fill={bg.AXIS_COLOR} font-family="Satoshi-Bold" font-size={y_title.font_size}
				text-anchor="middle" alignment-baseline="auto" dominant-baseline="auto"
			>
				{y_title.text}
			</text>
		</g>
	</g>
	<g class="plot">
		{#each points as point, i}
			<g class="point" opacity={group_selected === null || group_selected.ids.includes(point.answer) ? 1 : 0.25}>
				<g
					onclick={(event) => select_point(event, i, true)}
					onmouseenter={(event) => select_point(event, i, false)}
					onmouseleave={() => deselect_point(false)}
					onkeydown={null}
					class="dot {i == point_selected?.get_point().i ? 'selected_dot' : ''} cursor-pointer" role="button" tabindex={i}
					style="--dot-zoom: {point.focus_size / point.size};"
				>
					<circle
						cx={point.x}
						cy={point.y}
						r={point.size + POINT_HITBOX_EXTENSION * stats.sub_scales.point_stroke}
						fill="transparent"
					/>
					<circle
						cx={point.x}
						cy={point.y}
						r={point.size}
						fill={point.fill}
						stroke={point.stroke.color}
						stroke-width={point.stroke.width}
						stroke-dasharray={point.stroke.dasharray}
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</g>
				{#if point.label.shown}
					<text
						x={point.label.x} y={point.label.y} fill={point.stroke.color} class="unselectable"
						font-family="Satoshi-Bold" font-size={point.label.font_size}
						text-anchor="middle" alignment-baseline="central" dominant-baseline="central"
					>
							{#each point.label.text.split('\n') as line, i}
								<tspan x={point.label.x} dy={i === 0 ? -point.label.line_height * 0.5 : point.label.line_height}>
									{line}
								</tspan>
							{/each}
					</text>
				{/if}
			</g>
		{/each}
	</g>
</svg>

<style>
	.dot
	{
		transition: transform 0.2s ease-in-out;
		transform-origin: center;
		transform-box: fill-box;
	}

	.dot:hover
	{
		transform: scale(var(--dot-zoom));
	}

	.dot:focus
	{
		transform: scale(var(--dot-zoom));
	}

	.selected_dot
	{
		transform: scale(var(--dot-zoom));
	}
</style>
