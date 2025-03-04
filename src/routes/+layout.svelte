<script lang="ts">
	import '../app.css';
	import '../fonts.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/favicon.png" />
</svelte:head>

<div class="app">
	<header>
	</header>

	<main>
		{@render children()}
	</main>

	<footer>
	</footer>
</div>

<style>
</style>
