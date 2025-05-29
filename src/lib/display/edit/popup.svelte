<script lang="ts">
	import type { Map } from '$lib/types/map';
	import Cross from '$lib/svgs/cross.svg';
	import Back from '$lib/svgs/back.svg';
	import type { Paper, SearchPaperResult } from '$lib/types/paper';
	import Search from './search.svelte';
	import Add from './add.svelte';
	import Send from './send.svelte';
	import type { Journal } from '$lib/types/journal';
	import { onMount } from 'svelte';

	let { route, map = $bindable(), journals = $bindable(), leaving_message = $bindable() }: {
		route: string,
		map: Map,
		journals: { [id: string]: Journal },
		leaving_message: boolean,
	} = $props();

	const leave_message = 'Are you sure? Any unsaved changes will be lost.';

	let shown = $state(false);
	let page: 'search' | 'add' | 'send' | null = $state(null);
	let result: SearchPaperResult | null = $state(null);
	let paper: Paper | null = $state(null);
	let add_element: Add | undefined = $state(undefined);
	let comment = $state('');
	let discord_username = $state('');

	export function show(page_: 'search' | 'add' | 'send')
	{
		page = page_;
		shown = true;
	}

	export function hide()
	{
		if (page === 'add' && add_element?.close_message())
			if (!confirm(leave_message))
				return;

		shown = false;
		result = null;
		paper = null;
		page = null;
	}

	export function go_back()
	{
		if (!confirm(leave_message))
			return;

		page = 'search';
	}

	onMount(() =>
	{
		document.addEventListener('edit_paper', (event: Event) =>
		{
			const uuid = (event as CustomEvent).detail as string | undefined;

			if (uuid === undefined)
				return;

			paper = map.papers[uuid];
			show('add');
		});
	});
</script>

<svelte:window onkeydown={(event) => { if (event.key === 'Escape') hide(); }}/>

<div class="popup-container absolute left-0 top-0 w-full h-full" style="display: {shown ? 'block' : 'none'};">
	<div
		class="background absolute left-0 top-0 w-full h-full bg-[#01012629]"
		onclick={hide} onkeydown={null} role="button" tabindex={0}
	></div>
	<div class="popup absolute flex-center-col overflow-hidden">
		<div class="cross absolute cursor-pointer right-0 top-0" onclick={hide} onkeydown={null} role="button" tabindex={0}>
			<img src={Cross} alt="Close"/>
		</div>
		{#if page === 'search'}
			<Search bind:result={result} bind:page={page}/>
		{:else if page === 'add'}
			{#if paper === null}
				<div class="back absolute cursor-pointer left-0 top-0" onclick={go_back} onkeydown={null} role="button" tabindex={0}>
					<img src={Back} alt="Back"/>
				</div>
			{/if}
			<Add bind:map={map} bind:journals={journals} {result} {paper} {hide} bind:this={add_element}/>
		{:else if page === 'send'}
			<Send
				{route} papers={map.papers}
				bind:leaving_message={leaving_message} bind:comment={comment}
				bind:discord_username={discord_username}
			/>
		{/if}
	</div>
</div>

<style>
	.popup-container
	{
		z-index: 10000;
	}

	.popup
	{
		z-index: 10001;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		background-color: white;
		border-radius: 1.8em;
		box-shadow: 0em 0.3em 5em #01012640;
		--padding-size: 3.5em;
		padding: calc(var(--padding-size) * 0.85) 0 var(--padding-size) 0;
		width: 40em;
		max-width: calc(100vw - 3em);
		max-height: calc(100vh - 3em);
	}

	@media screen and (max-width: 430px)
	{
		.popup
		{
			--padding-size: 2.5em;
		}
	}

	.cross, .back
	{
		border-radius: 1em;
		margin: 0.5em;
		padding: 0.8em;
		opacity: 0.5;
		transition: opacity 0.1s ease-in-out;
	}

	.cross:hover, .back:hover
	{
		opacity: 0.85;
	}

	.cross img
	{
		width: 1em;
		height: 1em;
	}

	.back img
	{
		width: 1.2em;
		height: 1.2em;
	}
</style>
