<script lang="ts">
	import { onMount } from 'svelte';
	import { constants as C } from '$lib/client/utils';
	import type { PageProps } from './$types';
	import { paper_to_datapaper, type DataPaper } from '$lib/types/paper';

	let { data }: PageProps = $props();

	const page_url = `${C.BASE_URL}/maps/${data.map}`;
	const image_url = `${C.BASE_URL}/images/${data.map}.jpg?v=${data.image_hash}`;
	let edit_test = paper_to_datapaper(data.data.papers[0]);
	edit_test.citations.count = 79;

	onMount(() => {
		console.log(data.data);
		console.log(data.data.papers[0].score);
		console.log(`Current map: ${data.map}`);
	});

	async function edit(edits: string[])
	{
		const response = await fetch(`/maps/${data.map}/edit`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ comment: 'test comment', edits: { 0: edit_test } }),
		});

		if (!response.ok)
		{
			console.error('Failed to edit:', response.statusText);
			return;
		}

		const result = await response.json();
		console.log('Edit successful:', result);
	}
</script>

<svelte:head>
	<title>Map {data.map}</title>
	<meta name="description" content="Svelte demo app"/>
	<meta property="og:url" content={page_url}/>
	<meta property="og:image" content={image_url} />
	<meta property="og:image:url" content={image_url} />
	<meta property="og:image:secure_url" content={image_url} />
	<meta property="og:image:type" content="image/jpeg"/>
	<meta property="og:image:width" content=968/>
	<meta property="og:image:height" content=936/>
	<meta property="og:title" content="Map {data.map}"/>
	<meta property="og:site_name" content="Papermap {data.map}"/>
	<meta property="og:description" content="Papermap {data.map}."/>
	<meta name="twitter:title" content="Papermap {data.map}"/>
	<meta name="twitter:description" content="Papermap {data.map}."/>
	<meta name="twitter:image" content={image_url}/>
	<meta name="twitter:card" content="summary_large_image"/>
	<meta name="twitter:site" content="@DIMENSION_YT"/>
	<meta property="twitter:domain" content="papermap.org"/>
	<meta property="twitter:url" content={page_url}/>
</svelte:head>

<h1>Map {data.map}</h1>

<button onclick={() => edit(['edit_1', 'edit_2', 'edit_3'])}>button</button>

<style>
</style>
