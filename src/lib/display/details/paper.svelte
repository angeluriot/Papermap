<script lang="ts">
	import type { GraphPoint } from '../graph/types';
	import type { Paper } from '$lib/types/paper';

	const { point, paper }: { point: GraphPoint, paper: Paper } = $props();

	const arrow_size = 4;
</script>

<div>
	<div
		class="details-container absolute bg-amber-950"
		style="left: calc({point.x + point.focus_size}px + 2em); top: {point.y}px;"
	>
	</div>
	<div
		class="arrow absolute bg-amber-500"
		style="left: calc({point.x + point.focus_size}px + 2em); top: {point.y}px; width: {arrow_size}em; height: {arrow_size}em;"
	>
	</div>
</div>

<style>
	.details-container
	{
		border-radius: 1.5em;
		width: 20em;
		height: 30em;
	}

	.arrow
	{
		border-radius: 0em;/*0.7em;*/
		transform: rotate(45deg);
	}
</style>
