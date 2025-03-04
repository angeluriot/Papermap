<script lang="ts">
	import { onMount } from 'svelte';
	import { constants as C } from '$lib/utils';
	import type { PageProps } from './$types';
	import { paper_to_datapaper, ReviewType } from '$lib/types/paper';
	import Graph from '$lib/display/graph.svelte';

	const { data }: PageProps = $props();

	const map = data.map;
	const journals = data.journals;
	const route = `maps/${map.group}/${map.id}`;
	const page_url = `${C.BASE_URL}/${route}`;
	const image_url = `${page_url}/image.jpg?v=${data.image_hash}`;
	const title = map.question;
	const description = `Papermap: ${map.detailed_question}`;
	const tags = C.DEFAULT_TAGS.concat(map.tags);

	let edit_test = paper_to_datapaper(map.papers[0]);
	edit_test.citations.count = 79;

	let width = $state(100);
	let height = $state(100);

	function update_size(): void
	{
		width = window.innerWidth;
		height = window.innerHeight;
	}

	onMount(() => {
		console.log(data);
		update_size();
	});

	async function edit(): Promise<void>
	{
		const response = await fetch(`/${route}/edit`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				username: 'angeluriot',
				contact: 'test contact',
				comment: 'test comment',
				edits: { deleted: [], edited: { 0: edit_test }, added: [] }
			}),
		});

		if (!response.ok)
		{
			console.error('Failed to edit:', response.statusText);
			return;
		}

		const result = await response.json() as { pr_url: string };
		console.log('Edit successful:', result.pr_url);
	}
</script>

<svelte:window on:resize={update_size}/>

<svelte:head>
	<title>{title}</title>

	<meta name="description" content={description}/>
	<meta name="keywords" content={tags.join(', ')}/>
	<meta name="subject" content={map.group.name}/>
	<meta name="topic" content={map.group.name}/>
	<meta name="summary" content={description}/>
	<meta name="url" content={page_url}/>
	<meta name="pagename" content={title}/>

	<meta property="og:title" content={title}/>
	<meta property="og:url" content={page_url}/>
	<meta property="og:image" content={image_url}/>
	<meta property="og:image:url" content={image_url}/>
	<meta property="og:image:secure_url" content={image_url}/>
	<meta property="og:image:width" content=968/>
	<meta property="og:image:height" content=936/>
	<meta property="og:description" content={description}/>
	<meta property="article:tag" content={tags.join(', ')}/>

	<meta name="twitter:title" content={title}/>
	<meta name="twitter:description" content={description}/>
	<meta name="twitter:image" content={image_url}/>
	<meta name="twitter:image:src" content={image_url}/>
	<meta name="twitter:image:alt" content={title}/>
	<meta name="twitter:url" content={page_url}/>
</svelte:head>

<div class="w-full h-full">
	<Graph {map} width={width} height={height}/>
</div>

<style>
</style>
