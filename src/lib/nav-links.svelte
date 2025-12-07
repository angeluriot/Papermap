<script lang="ts">
	import Home from '$lib/svgs/home.svg?raw';
	import Random from '$lib/svgs/random.svg?raw';
	import ThemeToggle from '$lib/theme-toggle.svelte';
</script>

<div class="links flex-center-row flex">
    <ThemeToggle class="w-[52.13px] h-[52.13px]"/>
	<a href="/maps/random" title="Random map">
		{@html Random}
	</a>
	<a href="/" title="Home">
		{@html Home}
	</a>
</div>

<style>
	.links
	{
		gap: 0.6em;
		margin-top: -0.2em;
		filter: drop-shadow(0em 0.1em 0.5em var(--shadow-light));
		transform: translateZ(0);
	}

	.links :not(.theme-toggle) :global(svg)
	{
		width: 1.9em;
		height: 1.9em;
		transition: transform 0.2s ease-in-out;
	}

	.links :global(svg circle:first-child)
	{
		fill: var(--primary);
	}

	.links *:hover :global(svg)
	{
		transform: scale(1.08);
	}

	.links *:active :global(svg)
	{
		transition: none;
		transform: scale(1);
	}
</style>
