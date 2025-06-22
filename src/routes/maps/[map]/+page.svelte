<script lang="ts">
	import { constants as C } from '$lib/utils';
	import type { PageProps } from './$types';
	import { Edit, paper_to_datapaper } from '$lib/types/paper';
	import Graph from '$lib/display/graph/graph.svelte';
	import type { GraphPoint } from '$lib/display/graph/types';
	import Title from '$lib/display/title.svelte';
	import Overview from '$lib/display/overview.svelte';
	import PaperDetails from '$lib/display/details/paper_bubble.svelte';
	import DefaultButtons from '$lib/display/buttons/default.svelte';
	import EditButtons from '$lib/display/buttons/edit.svelte';
	import Home from '$lib/svgs/home.svg';
	import Popup from '$lib/display/edit/popup.svelte';
	import { onMount } from 'svelte';
	import cloneDeep from 'clone-deep';
	import deepEqual from 'deep-equal';

	const { data }: PageProps = $props();

	const emojis = data.emojis;
	const route = `maps/${data.map.id}`;
	const page_url = `${C.BASE_URL}/${route}`;
	const image_url = `${page_url}/preview.jpg?v=${data.hash}`;
	const tags = C.DEFAULT_TAGS.concat(data.map.tags);
	const initial_papers = cloneDeep(data.map.papers);

	let map = $state(data.map);
	let journals = $state(data.journals);
	let width = $state(0);
	let height = $state(0);
	let point_selected: { get_point: () => GraphPoint, keep: boolean } | null = $state(null);
	let group_selected: { i: number, ids: string[], keep: boolean } | null = $state(null);
	let journal_info_open = $state(false);
	let input_selected = $state(false);
	let details_element: HTMLDivElement | null = $state(null);
	let edit_mode = $state(false);
	let popup: Popup | undefined = $state(undefined);
	let leaving_message = $state(true);

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

	function on_leaving_edit_mode(event: Event)
	{
		if (!leaving_message || !edit_mode || Object.values(map.papers).every(paper => paper.edit === undefined))
			return;

		event.preventDefault();
		return 'You have unsaved changes, are you sure you want to leave?';
	}

	onMount(() =>
	{
		document.addEventListener('delete_paper', (event: Event) =>
		{
			const uuid = (event as CustomEvent).detail as string | undefined;

			if (uuid === undefined)
				return;

			if (map.papers[uuid].edit === Edit.Added)
			{
				point_selected = null;
				delete map.papers[uuid];
			}

			else
			{
				if (map.papers[uuid].edit === Edit.Edited)
					map.papers[uuid] = cloneDeep(initial_papers[uuid]);

				map.papers[uuid].edit = Edit.Deleted;
			}
		});

		document.addEventListener('recreate_paper', (event: Event) =>
		{
			const uuid = (event as CustomEvent).detail as string | undefined;

			if (uuid === undefined)
				return;

			delete map.papers[uuid].edit;
		});

		document.addEventListener('edit_paper', (event: Event) =>
		{
			point_selected = null;
		});

		document.addEventListener('cancel_changes', (event: Event) =>
		{
			const uuid = (event as CustomEvent).detail as string | undefined;

			if (uuid === undefined)
				return;

			map.papers[uuid] = cloneDeep(initial_papers[uuid]);
		});

		document.addEventListener('paper_edited', (event: Event) =>
		{
			const uuid = (event as CustomEvent).detail as string | undefined;

			if (uuid === undefined)
				return;

			const initial_paper = initial_papers[uuid];
			const current_paper = map.papers[uuid];

			if (initial_paper === undefined || current_paper === undefined || current_paper.edit !== Edit.Edited)
				return;

			const initial = paper_to_datapaper(JSON.parse(JSON.stringify(initial_paper)));
			const current = paper_to_datapaper(JSON.parse(JSON.stringify(current_paper)));

			if (deepEqual(initial, current))
				delete current_paper.edit;
		});
	});
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} onbeforeunload={on_leaving_edit_mode}/>

<svelte:head>
	<title>{map.question.short}</title>

	<meta name="description" content={map.description}/>
	<meta name="keywords" content={tags.join(', ')}/>
	<meta name="subject" content={map.groups[map.groups.length - 1].name}/>
	<meta name="topic" content={map.groups[map.groups.length - 1].name}/>
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
	<div class="top flex flex-row justify-start items-start flex-nowrap relative unselectable">
		<div class="title-container flex flex-row-reverse justify-center items-center flex-nowrap relative selectable" style="{input_selected ? 'z-index: 100000;' : ''}">
			<div class="title-component relative">
				<Title {emojis} {map} maps={data.maps} {width} {height} bind:input_selected={input_selected}/>
			</div>
			<a href={'/'}>
				<img src={Home} alt="Home" title="Home" class="home relative img-unselectable">
			</a>
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
				{emojis} point={point_selected.get_point()} {map} {journals}
				paper={map.papers[point_selected.get_point().uuid]}
				{width} {height} bind:journal_info_open={journal_info_open} {edit_mode}
			/>
		{/if}
	</div>
	<div class="buttons absolute bottom-0 right-0">
		{#if edit_mode}
			<EditButtons {map} add={() => { popup?.show('search'); point_selected = null; }} submit={() => popup?.show('send') }/>
		{:else}
			<DefaultButtons {map} hash={data.hash} bind:edit_mode={edit_mode}/>
		{/if}
	</div>
	{#if edit_mode}
		<div class="popup">
			<Popup {route} bind:map={map} bind:journals={journals} bind:this={popup} bind:leaving_message={leaving_message}/>
		</div>
	{/if}
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
		transform: translateZ(0);
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

	.popup
	{
		font-size: clamp(11px, calc(calc(0.15vw + 5px) * 2), 16px);
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

		.title-component:hover + a .home
		{
			opacity: 0;
		}
	}
</style>
