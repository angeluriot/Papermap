<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const base_url = import.meta.env.DEV ? 'http://localhost:5173' : 'https://my-app.com';
	const image_url = `${base_url}/maps/${data.map}/image.jpg`;

	onMount(() => {
		console.log(data.data);
		console.log(`Current map: ${data.map}`);
	});

	async function edit(edits: string[]) {
		const response = await fetch(`/map/${data.map}/edit`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ edits: edits })
		});

		if (!response.ok) {
			console.error('Failed to edit:', response.statusText);
			return;
		}

		const result = await response.json();
		console.log('Edit successful:', result);
	}
</script>

<svelte:head>
	<title>Map {data.map}</title>
	<meta name="description" content="Svelte demo app" />
	<meta property="og:image" content={image_url} />
</svelte:head>

<h1>Map {data.map}</h1>

<button onclick={() => edit(['edit_1', 'edit_2', 'edit_3'])}>button</button>

<style>
</style>
