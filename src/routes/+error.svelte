<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.status} - Error</title>
</svelte:head>

<div>
	<h1>{page.status}</h1>
	<p>{page.error?.message || 'An error occurred'}</p>
</div>

<style>
</style>
