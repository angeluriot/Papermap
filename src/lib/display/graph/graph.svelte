<script lang="ts">
	import type { Map } from '$lib/types/map';
	import * as bg from './background';
	import * as pt from './points';
	import type { GraphPoint } from './types';
	import { get_stats } from './utils';

	let { map, width, height, selected = $bindable() }: { map: Map, width: number, height: number, selected: { point: GraphPoint, keep: boolean } | null } = $props();

	const POINT_HITBOX_EXTENSION = 3;

	const stats = $derived(get_stats(map, width, height));
	const x_axis = $derived(bg.get_x_axis(stats));
	const y_axis = $derived(bg.get_y_axis(stats, x_axis));
	const x_title = $derived(bg.get_x_title(stats));
	const y_title = $derived(bg.get_y_title(stats, y_axis));
	const background_points = $derived(bg.get_background_points(x_axis, y_axis, stats));
	const points = $derived(pt.get_graph_points(map, stats));

	function select_point(event: Event, point: GraphPoint, clicked: boolean)
	{
		if (!(selected !== null && selected.keep && !clicked))
			selected = { point, keep: clicked };

		event.stopPropagation();
	}

	function deselect_point(clicked: boolean)
	{
		if (selected !== null && (clicked || !selected.keep))
			selected = null;
	}
</script>

<svg
	viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg"
	onclick={() => deselect_point(true)} onkeydown={null} role="button" tabindex={-1}
>
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
			<g
				onclick={(event) => select_point(event, point, true)}
				onmouseenter={(event) => select_point(event, point, false)}
				onmouseleave={() => deselect_point(false)}
				onkeydown={null}
				class="dot {selected?.point.index == point.index ? 'selected_dot' : ''} cursor-pointer" role="button" tabindex={i}
				style="--dot-zoom: {point.zoom};"
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
