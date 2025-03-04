<script lang="ts">
	import type { Map } from '$lib/types/map';
	import { get_x_axis, get_y_axis } from './background';
	import { get_graph_points } from './points';
	import { get_stats } from './utils';

	const { map, width, height }: { map: Map, width: number, height: number } = $props();

	const stats = $derived(get_stats(map, width, height));

	const BACKGROUND_COLOR = '#f3f4ff';
	const FONT_SIZE = $derived(7 * stats.axis_scale);
	const X_LABEL_PADDING = $derived(6 * stats.axis_scale);
	const Y_LABEL_PADDING = $derived(11.8 * stats.axis_scale);
	const CENTER_MASK_SIZE = $derived(35 * stats.axis_scale);

	const x_axis = $derived(get_x_axis(stats));
	const y_axis = $derived(get_y_axis(stats));
	const points = $derived(get_graph_points(map, stats));
</script>

<svg viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">
	<rect x=0 y=0 width={width} height={height} fill={BACKGROUND_COLOR}/>
	<g class="axis">
		<g class="x-axis">
			{#each x_axis as tick}
				<line
					x1={tick.start.x} y1={tick.start.y} x2={tick.end.x} y2={tick.end.y} stroke={tick.color}
					stroke-width={tick.width} stroke-linecap="round" stroke-linejoin="round"
				/>
				{#if tick.type == "major"}
					<text
						x={tick.start.x} y={tick.start.y - X_LABEL_PADDING} fill={tick.color}
						font-family="Satoshi-Variable" font-weight=700 font-size={FONT_SIZE}
						text-anchor="middle" alignment-baseline="central" dominant-baseline="central"
					>
						{tick.value}
					</text>
				{/if}
			{/each}
		</g>
		<g class="u-axis">
			{#each y_axis as tick}
				<line
					x1={tick.start.x} y1={tick.start.y} x2={tick.end.x} y2={tick.end.y} stroke={tick.color}
					stroke-width={tick.width} stroke-linecap="round" stroke-linejoin="round"
				/>
				{#if tick.type == "major"}
					<text
						x={tick.start.x + Y_LABEL_PADDING} y={tick.start.y - Y_LABEL_PADDING * 0.02} fill={tick.color}
						font-family="Satoshi-Variable" font-weight=700 font-size={FONT_SIZE}
						text-anchor="start" alignment-baseline="central" dominant-baseline="central"
					>
						{tick.value}
					</text>
				{/if}
			{/each}
		</g>
		<defs>
			<radialGradient id="center-mask-gradient" cx=0 cy={stats.height} r={CENTER_MASK_SIZE} gradientUnits="userSpaceOnUse">
				<stop offset=0% stop-color={BACKGROUND_COLOR} stop-opacity=1/>
				<stop offset=30% stop-color={BACKGROUND_COLOR} stop-opacity=1/>
				<stop offset=100% stop-color={BACKGROUND_COLOR} stop-opacity=0/>
			</radialGradient>
		</defs>
		<circle cx=0 cy={stats.height} r={CENTER_MASK_SIZE} fill="url(#center-mask-gradient)"/>
	</g>
	<g class="plot">
		{#each points as point}
			<circle cx={point.x} cy={point.y} r={point.size} fill="blue"/>
		{/each}
	</g>
</svg>

<style>
</style>
