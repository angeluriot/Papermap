<script lang="ts">
	import { clamp } from '$lib/utils';

	const { width, height, page_height }: { width: number, height: number, page_height: number } = $props();

	const dots_style = $derived.by(() =>
	{
		const final_height = Math.max(height, page_height + 90);
		const scale = (width + final_height) / 2;
		const dots_gap = clamp(15 + scale * 0.018, 30, 45);
		const dots_size = clamp(2 + scale * 0.00055, 2.4, 2.9);

		const background_size = `${dots_gap}px ${dots_gap}px`;
		const dots_width = `${width + (dots_gap - width % dots_gap)}px`;
		let dots_height = `${final_height + (dots_gap - final_height % dots_gap)}px`;

		if (page_height + 90 <= height)
			dots_height = `${height - 10}px`;

		const background_image = `radial-gradient(circle ${dots_size}px, var(--point-color) 0%, var(--point-color) 80%, transparent 100%)`;

		return `background-size: ${background_size}; width: ${dots_width}; height: ${dots_height}; background-image: ${background_image};`;
	});
</script>

<div class="main-background absolute left-0 top-0 w-full h-full">
	<div class="dots absolute w-full h-full z-[2]" style="{dots_style}"></div>
	<div class="back-color absolute left-0 top-0 w-full h-full z-[1]"></div>
</div>

<style>
	.dots
	{
		left: 50%;
		top: 50%;
		transform: translate(-50%, -1.5em);
		width: 110vw;
		height: 110vh;
		background-image: radial-gradient(circle 2.25px, #d4bdff 0%, #d4bdff 80%, transparent 100%);
		opacity: 1;
	}
</style>
