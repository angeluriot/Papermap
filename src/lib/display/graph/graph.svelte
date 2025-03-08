<script lang="ts">
	import type { Map } from '$lib/types/map';
	import { clamp } from '$lib/utils';
	import { get_x_axis, get_y_axis, get_background_points, POINTS_SIZE, TICK_WIDTH as BG_TICK_WIDTH } from './background';
	import { get_graph_points } from './points';
	import type { GraphPoint } from './types';
	import { get_stats } from './utils';

	let { map, width, height, selected = $bindable() }: { map: Map, width: number, height: number, selected: { point: GraphPoint, keep: boolean } | null } = $props();

	const stats = $derived(get_stats(map, width, height));

	const BACKGROUND_COLOR = '#f3f4ff';

	const AXIS_COLOR = '#2d2f3d';
	const TICK_OPACITY = $derived({ major: 1, minor: 0.5 });
	const TICK_WIDTH = $derived(BG_TICK_WIDTH * stats.sub_scales.axis);
	const AXIS_FONT_SIZE = $derived(7 * stats.sub_scales.axis);

	const X_LABEL_DISTANCE = $derived(6 * stats.sub_scales.axis);
	const Y_LABEL_DISTANCE = $derived(11.8 * stats.sub_scales.axis);

	const LABEL_MIN_SOFT_X = $derived(14 * stats.sub_scales.axis);
	const LABEL_MIN_HARD_X = $derived(6 * stats.sub_scales.axis);
	const LABEL_MAX_SOFT_X = $derived(width - 10.5 * stats.sub_scales.axis);
	const LABEL_MAX_HARD_X = $derived(width - 1 * stats.sub_scales.axis);

	const LABEL_MIN_SOFT_Y = $derived(5 * stats.sub_scales.axis);
	const LABEL_MIN_HARD_Y = $derived(1.25 * stats.sub_scales.axis);
	const LABEL_MAX_SOFT_Y = $derived(height - 9 * stats.sub_scales.axis);
	const LABEL_MAX_HARD_Y = $derived(height - 5 * stats.sub_scales.axis);
	const LABEL_CENTER_X = $derived(29 * stats.sub_scales.axis);
	const LABEL_CENTER_Y = $derived(height - 17 * stats.sub_scales.axis);

	const BACKGROUND_POINTS_SIZE = $derived(POINTS_SIZE * stats.sub_scales.axis);
	const BACKGROUND_POINTS_COLOR = '#3131ff';
	const BACKGROUND_POINTS_OPACITY = 0.12;

	const x_axis = $derived(get_x_axis(stats));
	const y_axis = $derived(get_y_axis(stats));
	const background_points = $derived(get_background_points(x_axis, y_axis, stats));
	const x_in_center = $derived(x_axis.find(tick => tick.type === 'major' && tick.start.x > LABEL_MIN_HARD_X && tick.start.x < LABEL_CENTER_X) !== undefined);

	const POINT_STROKE_WIDTH = $derived(1.2 * stats.sub_scales.point_stroke);
	const POINT_FONT_SIZE = $derived(5 * stats.sub_scales.point_stroke);

	const points = $derived(get_graph_points(map, stats));

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
		<rect x=0 y=0 width={width} height={height} fill={BACKGROUND_COLOR}/>
		<g class="points">
			{#each background_points as point}
				<circle cx={point.x} cy={point.y} r={BACKGROUND_POINTS_SIZE} fill={BACKGROUND_POINTS_COLOR} opacity={BACKGROUND_POINTS_OPACITY}/>
			{/each}
		</g>
		<g class="x-axis">
			{#each x_axis as tick}
				{#if tick.type !== null}
					<line
						x1={tick.start.x} y1={tick.start.y} x2={tick.end.x} y2={tick.end.y} stroke={AXIS_COLOR}
						stroke-width={TICK_WIDTH} stroke-linecap="round" stroke-linejoin="round" opacity={TICK_OPACITY[tick.type]}
					/>
				{/if}
				{#if tick.type === "major" && tick.start.x > LABEL_MIN_HARD_X && tick.start.x < LABEL_MAX_HARD_X}
					<text
						x={clamp(tick.start.x, LABEL_MIN_SOFT_X, LABEL_MAX_SOFT_X)} y={tick.start.y - X_LABEL_DISTANCE}
						fill={AXIS_COLOR} font-family="Satoshi-Variable" font-weight=700 font-size={AXIS_FONT_SIZE}
						text-anchor="middle" alignment-baseline="central" dominant-baseline="central"
					>
						{tick.value_text}
					</text>
				{/if}
			{/each}
		</g>
		<g class="y-axis">
			{#each y_axis as tick}
				{#if tick.type !== null}
					<line
						x1={tick.start.x} y1={tick.start.y} x2={tick.end.x} y2={tick.end.y} stroke={AXIS_COLOR}
						stroke-width={TICK_WIDTH} stroke-linecap="round" stroke-linejoin="round" opacity={TICK_OPACITY[tick.type]}
					/>
				{/if}
				{#if tick.type === "major" && tick.start.y > LABEL_MIN_HARD_Y && tick.start.y < LABEL_MAX_HARD_Y && !(x_in_center && tick.start.y > LABEL_CENTER_Y)}
					<text
						x={tick.start.x + Y_LABEL_DISTANCE} y={clamp(tick.start.y - Y_LABEL_DISTANCE * 0.02, LABEL_MIN_SOFT_Y, LABEL_MAX_SOFT_Y)}
						fill={AXIS_COLOR} font-family="Satoshi-Variable" font-weight=700 font-size={AXIS_FONT_SIZE}
						text-anchor="start" alignment-baseline="central" dominant-baseline="central"
					>
						{tick.value_text}
					</text>
				{/if}
			{/each}
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
			>
				<circle
					cx={point.x}
					cy={point.y}
					r={point.size + 3 * stats.sub_scales.point_stroke}
					fill="transparent"
				/>
				<circle
					cx={point.x}
					cy={point.y}
					r={point.size}
					fill={point.fill}
					stroke={point.stroke}
					stroke-width={POINT_STROKE_WIDTH}
				/>
			</g>
			{#if point.label.shown}
				<text
					x={point.label.x} y={point.label.y} fill={point.stroke}
					font-family="Satoshi-Variable" font-weight=750 font-size={POINT_FONT_SIZE}
					text-anchor="middle" alignment-baseline="central" dominant-baseline="central"
				>
						{#each point.label.text.split('\n') as line, i}
							<tspan x={point.label.x} dy={i === 0 ? 0 : POINT_FONT_SIZE * 1.2}>
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
		transform: scale(1.1);
	}

	.dot:focus
	{
		transform: scale(1.1);
		outline: none;
	}

	.selected_dot
	{
		transform: scale(1.1);
	}
</style>
