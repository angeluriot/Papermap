<script lang="ts">
	import { onMount } from 'svelte';
	import Sun from '$lib/svgs/sun.svg?raw';
	import Moon from '$lib/svgs/moon.svg?raw';

	let { class: className = '' }: { class?: string } = $props();

	let dark_mode = $state(false);

	onMount(() => {
		// Check for saved theme preference or default to light mode
		const saved_theme = localStorage.getItem('theme');
		if (saved_theme === 'dark') {
			dark_mode = true;
			document.documentElement.classList.add('dark');
		} else {
			dark_mode = false;
			document.documentElement.classList.remove('dark');
		}
	});

	function toggle_theme() {
		dark_mode = !dark_mode;
		if (dark_mode) {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	}
</script>

<a
	href={undefined}
	class="theme-toggle {className}"
	onclick={toggle_theme}
	aria-label="Toggle dark mode"
	title={dark_mode ? 'Switch to light mode' : 'Switch to dark mode'}
>
	{#if dark_mode}
		<!-- Sun icon for light mode -->
		{@html Sun}
	{:else}
		<!-- Moon icon for dark mode -->
		{@html Moon}
	{/if}
</a>

<style>
	.theme-toggle
	{
		border-radius: 50%;
		background-color: var(--secondary);
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 0.2em 1em rgba(0, 0, 0, 0.15);
		transition: all 0.3s ease;
		color: var(--text-primary);
	}

	.theme-toggle:hover
	{
		transform: scale(1.1);
		box-shadow: 0 0.3em 1.5em rgba(0, 0, 0, 0.2);
	}

	.theme-toggle:active
	{
		transform: scale(0.95);
	}

	.theme-toggle :global(svg)
	{
		stroke: var(--text-primary);
	}
</style>
