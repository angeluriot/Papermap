<script lang="ts">
	import type { SearchPaperResult } from '$lib/types/paper';
	import Loading from '../loading.svelte';
	import Link from '$lib/svgs/link.svg';

	let { result = $bindable(), page = $bindable() }: {
		result: SearchPaperResult | null,
		page: 'search' | 'add' | 'send',
	} = $props();

	let doi = $state('');
	let title = $state('');
	let year: number | null = $state(null);
	let had_error = $state(false);
	let loading = $state(false);

	function can_search()
	{
		return doi.trim().length > 0 || (title.trim().length > 0 && year !== null);
	}

	async function search()
	{
		if (loading)
			return;

		loading = true;

		if (!can_search())
			return;

		let query_params: Record<string, string> = {};

		if (doi.trim().length > 0)
			query_params['doi'] = doi.trim();

		if (title.trim().length > 0)
			query_params['title'] = title.trim();

		if (year !== null && !isNaN(year))
			query_params['year'] = year.toString();

		let query = new URLSearchParams(query_params);

		const response = await fetch('/search?' + query.toString(), {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		});

		if (!response.ok)
		{
			let error_message = 'An unknown error occurred.';

			if (response.status === 429)
				error_message = 'You are sending too many requests, please wait a moment before trying again.';

			if (response.status === 400)
			{
				const result = await response.json() as { message: string };
				error_message = `Your request is incorrect: "${result.message}".`;
			}

			if (response.status === 502)
				error_message = 'There is an issue with OpenAlex, please try again later.';

			if (response.status === 500)
				error_message = 'There is an issue with the server, please try again later.';

			alert(error_message);
			had_error = true;
			loading = false;
			return;
		}

		const response_json = await response.json() as { results: SearchPaperResult[] };

		if (response_json.results.length !== 1)
		{
			alert('Paper not found, try adding more information.');
			had_error = true;
			loading = false;
			return;
		}

		result = response_json.results[0];
		page = 'add';
	}

	function create()
	{
		if (loading)
			return;

		loading = true;
		let res: Record<string, string> = {};

		if (doi.trim().length > 0)
			res['doi'] = doi.trim();

		if (title.trim().length > 0)
			res['title'] = title.trim();

		if (year !== null && !isNaN(year))
			res['year'] = year.toString();

		result = Object.keys(res).length > 0 ? res : null;
		loading = false;
		page = 'add';
	}
</script>

<div class="search-container flex-center-col">
	<div class="title flex-center-col">
		<h1 class="unselectable">Add a new paper</h1>
		<a href="https://github.com/angeluriot/Papermap/blob/main/doc/contribute/paper.md" target="_blank" class="help flex-center-row">
			<img src={Link} alt="link" class="img-unselectable"/>
			<span class="unselectable">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;How to add a paper?</span>
		</a>
	</div>
	<div class="input">
		<div class="label unselectable flex-center-row">
			<span>DOI link</span>
		</div>
		<input bind:value={doi} type="text" placeholder="The DOI link of the paper"/>
	</div>
	<div class="line w-full relative unselectable">
		<div class="w-full rounded-full"></div>
		<span class="absolute">OR</span>
	</div>
	<div class="input">
		<div class="label unselectable flex-center-row">
			<span>Title</span>
		</div>
		<input bind:value={title} type="text" placeholder="The title of the paper"/>
	</div>
	<div class="input mt-[-0.5em]">
		<div class="label unselectable flex-center-row">
			<span>Year</span>
		</div>
		<input bind:value={year} type="number" min=1500 max={new Date().getFullYear()} placeholder="The year of publication"/>
	</div>
	<div class="buttons w-full flex-center-row text-nowrap" style="{had_error ? 'justify-content: space-evenly;' : ''}">
		<button
			class="button search-button relative flex-center-col {loading || can_search() ? '' : 'disabled'}"
			style="{had_error ? '' : 'padding: 1em 4em;'} {loading ? 'pointer-events: none;' : ''}" onclick={search}
		>
			<span class="unselectable" style="{loading ? 'opacity: 0;' : ''}">
				Search
			</span>
			{#if loading}
				<div class="loading">
					<Loading color="#1b524e"/>
				</div>
			{/if}
		</button>
		{#if had_error}
			<button
				class="button create-button relative flex-center-col"
				style="{loading ? 'pointer-events: none;' : ''}" onclick={create}
			>
				<span class="unselectable" style="{loading ? 'opacity: 0;' : ''}">
					Create manually
				</span>
				{#if loading}
					<div class="loading">
						<Loading color="#31375b"/>
					</div>
				{/if}
			</button>
		{/if}
	</div>
</div>

<style>
	.search-container
	{
		padding: 0 var(--padding-size);
		gap: 1.5em;
		width: 100%;
	}

	.title
	{
		margin-bottom: 0.5em;
		gap: 0.2em;
	}

	h1
	{
		color: #303037;
		font-size: 1.25em;
		font-family: Satoshi-Variable, sans-serif;
		font-weight: 500;
		line-height: 1.5em;
	}

	.help
	{
		font-family: Satoshi-Variable, sans-serif;
		line-height: 1.5em;
		font-weight: 500;
		color: #9193a2;
	}

	.help:hover
	{
		text-decoration: underline;
	}

	.help img
	{
		width: 0.95em;
		height: 0.95em;
		margin-top: -0.15em;
		margin-right: -0.95em;
	}

	.line
	{
		margin: 1.2em 0em 0.5em 0em;
	}

	.line div
	{
		height: 2px;
		background-color: rgb(205, 205, 220);
	}

	.line span
	{
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		color: rgb(205, 205, 220);
		background-color: white;
		padding: 0em 0.4em;
		font-size: 1.1em;
		line-height: 1.5em;
		font-weight: 500;
		font-family: Satoshi-Variable, sans-serif;
	}

	.input
	{
		width: 100%;
		max-width: calc(100vw - 3em);
		display: flex;
		flex-direction: column;
		justify-content: start;
		align-items: start;
		color: #303037;
	}

	.input .label
	{
		font-family: Satoshi-Variable, sans-serif;
		font-weight: 500;
		line-height: 1.5em;
		border-radius: 0.5em;
		margin-left: 0.2em;
	}

	.input input
	{
		width: 100%;
		border-color: #dbdbe8;
		border-width: 2px;
		background-color: #fbfbfd;
		padding: 0.4em 0.6em;
		font-family: Satoshi-Variable, sans-serif;
		font-weight: 465;
		line-height: 1.5em;
		border-radius: 0.5em;
		color: rgb(77, 77, 92);
	}

	.input input:focus
	{
		outline: none;
		border-color: rgb(173, 173, 194);
	}

	.input input::placeholder
	{
		color: rgb(173, 173, 194);
		pointer-events: none;
		user-select: none;
		-moz-user-select: none;
		-webkit-user-drag: none;
		-webkit-user-select: none;
		-ms-user-select: none;
		-o-user-select: none;
	}

	.buttons
	{
		gap: 1em;
	}

	.button
	{
		cursor: pointer;
		border-width: 2px;
		font-family: Satoshi-Variable, sans-serif;
		font-weight: 475;
		line-height: 1.5em;
		border-radius: 1.5em;
		padding: 1em 3em;
		transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, color 0.2s ease-in-out;
		margin-top: 1em;
	}

	@media screen and (max-width: 360px)
	{
		.button
		{
			padding: 1em 2em;
		}
	}

	.search-button
	{
		background-color: rgb(122, 243, 191);
		border-color: rgb(86, 200, 162);
		color: rgb(27, 82, 78);
	}

	.search-button:hover
	{
		background-color: rgb(110, 231, 186);
	}

	.create-button
	{
		background-color: rgb(133, 174, 255);
		border-color: rgb(91, 117, 219);
		color: rgb(49, 55, 91);
	}

	.create-button:hover
	{
		background-color: #7ca1f5;
	}

	.disabled
	{
		pointer-events: none;
		background-color: rgb(240, 240, 247);
		border-style: dashed;
		border-color: rgb(211, 212, 232);
		color: rgb(155, 155, 183);
	}

	@media screen and (max-width: 1100px)
	{
		.line div
		{
			height: 1px;
		}

		.input input
		{
			border-width: 1px;
		}

		.button
		{
			border-width: 1px;
		}
	}

	.loading
	{
		font-size: 0.5em;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
