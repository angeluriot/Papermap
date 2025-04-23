<script lang="ts">
	import { constants as C } from '$lib/utils';
	import type { PageProps } from './$types';
	import { paper_to_datapaper } from '$lib/types/paper';
	import Graph from '$lib/display/graph/graph.svelte';
	import type { GraphPoint } from '$lib/display/graph/types';
	import Title from '$lib/display/title.svelte';
	import Overview from '$lib/display/overview.svelte';
	import PaperDetails from '$lib/display/details/paper_bubble.svelte';
	import Buttons from '$lib/display/buttons/buttons.svelte';
	import Home from '$lib/svgs/home.svg';

	const { data }: PageProps = $props();

	const map = data.map;
	const journals = data.journals;
	const route = `maps/${map.group.id}/${map.id}`;
	const page_url = `${C.BASE_URL}/${route}`;
	const image_url = `${page_url}/preview.jpg?v=${data.hash}`;
	const tags = C.DEFAULT_TAGS.concat(map.tags);

	let width = $state(0);
	let height = $state(0);
	let point_selected: { get_point: () => GraphPoint, keep: boolean } | null = $state(null);
	let group_selected: { i: number, ids: string[], keep: boolean } | null = $state(null);
	let journal_info_open = $state(false);
	let input_selected = $state(false);
	let details_element: HTMLDivElement | null = $state(null);

	function deselect_point()
	{
		if (C.TOUCH_SCREEN)
			return;

		if (point_selected !== null && !point_selected.keep)
		{
			journal_info_open = false;
			point_selected = null;
		}
	}

	let edit_test = paper_to_datapaper(map.papers[0]);
	edit_test.citations.count = 79;

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

<svelte:window bind:innerWidth={width} bind:innerHeight={height}/>

<svelte:head>
	<title>{map.question.short}</title>

	<meta name="description" content={map.description}/>
	<meta name="keywords" content={tags.join(', ')}/>
	<meta name="subject" content={map.group.name}/>
	<meta name="topic" content={map.group.name}/>
	<meta name="summary" content={map.description}/>
	<meta name="url" content={page_url}/>
	<meta name="pagename" content={map.question.short}/>

	<meta property="og:title" content={map.question.short}/>
	<meta property="og:url" content={page_url}/>
	<meta property="og:image" content={image_url}/>
	<meta property="og:image:url" content={image_url}/>
	<meta property="og:image:secure_url" content={image_url}/>
	<meta property="og:image:width" content=1200/>
	<meta property="og:image:height" content=630/>
	<meta property="og:description" content={map.description}/>
	<meta property="article:tag" content={tags.join(', ')}/>

	<meta name="twitter:title" content={map.question.short}/>
	<meta name="twitter:description" content={map.description}/>
	<meta name="twitter:image" content={image_url}/>
	<meta name="twitter:image:src" content={image_url}/>
	<meta name="twitter:image:alt" content={map.question.short}/>
	<meta name="twitter:url" content={page_url}/>
</svelte:head>

<div class="absolute w-full h-full overflow-hidden">
	<div class="absolute w-full h-full overflow-hidden">
		{#if width > 0 && height > 0}
			<Graph
				{map} width={width} height={height}
				bind:point_selected={point_selected} bind:group_selected={group_selected}
				bind:journal_info_open={journal_info_open} bind:input_selected={input_selected}
				details_element={details_element}
			/>
		{/if}
	</div>
	<div class="top flex flex-row justify-start items-start flex-nowrap relative">
		<div class="title-container flex-center-row flex-nowrap relative" style="{input_selected ? 'z-index: 100000;' : ''}">
			<a href={'/'}>
				<img src={Home} alt="Home" class="home relative img-unselectable">
			</a>
			<Title {map} maps={data.maps} {width} {height} bind:input_selected={input_selected}/>
		</div>
		<Overview
			{map} bind:group_selected={group_selected}
			bind:point_selected={point_selected}
			bind:journal_info_open={journal_info_open}
			bind:input_selected={input_selected}
		/>
	</div>
	<div
		class="details"
		bind:this={details_element}
		onmouseleave={deselect_point}
		role="button" tabindex={0}
	>
		{#if point_selected !== null}
			<PaperDetails
				point={point_selected.get_point()} {map} {journals}
				paper={map.papers[point_selected.get_point().index]}
				{width} {height} bind:journal_info_open={journal_info_open}
			/>
		{/if}
	</div>
	<div class="buttons absolute bottom-0 right-0">
		<Buttons {map} hash={data.hash}/>
	</div>
</div>

<style>
	.top
	{
		font-size: clamp(12px, calc(calc(0.17vw + 5.5px) * 2), 18px);
		margin: 1.5em;
		gap: 1.5em;
	}

	.title-container
	{
		gap: 0.65em;
		filter: drop-shadow(0em 0.1em 0.75em #00008036);
	}

	.home
	{
		min-width: 3.15em;
		min-height: 3.15em;
		width: 3.15em;
		height: 3.15em;
		transition: transform 0.2s ease-in-out;
	}

	.home:hover
	{
		transform: scale(1.06);
	}

	.home:active
	{
		transition: none;
		transform: scale(1);
	}

	.details
	{
		font-size: clamp(10px, calc(calc(calc(0.09vw + 0.09vh) + 4.5px) * 2), 15px);
	}

	.buttons
	{
		font-size: clamp(10px, calc(calc(calc(0.09vw + 0.09vh) + 4.5px) * 2), 15px);
	}

	@media screen and (max-width: 800px)
	{
		.top
		{
			gap: 1.2em;
		}
	}

	@media screen and (max-width: 600px)
	{
		.top
		{
			flex-direction: column;
			align-items: end;
		}
	}
</style>
