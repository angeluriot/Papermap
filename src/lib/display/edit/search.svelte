<script lang="ts">
	import type { SearchPaperResult } from '$lib/types/paper';

	let doi = $state('');
	let title = $state('');
	let year = $state('');
	let result: SearchPaperResult | null = $state(null);

	function can_search()
	{
		return doi.trim().length > 0 || (title.trim().length > 0 && year.trim().length > 0);
	}

	async function search()
	{
		if (!can_search())
			return;

		let query = [];

		for (const [key, value] of Object.entries({ doi, title, year }))
			if (value.trim().length > 0)
				query.push(`${key}=${encodeURIComponent(value.trim())}`);

		const response = await fetch(`/search?${query.join('&')}`, {
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
			return;
		}

		const result = await response.json() as { results: SearchPaperResult[] };

		if (response.status === 404)
		{
			alert('Paper not found, try using the DOI link.');
			return;
		}

		if (response.status === 409)
		{
			alert('Multiple papers found, please be more specific in your search.');
			return;
		}
	}
</script>

<div class="search-container flex-center-col">
	<h1 class="unselectable">Add a new paper</h1>
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
		<input bind:value={year} type="text" placeholder="The year of publication"/>
	</div>
	<button class="button flex-center-col {can_search() ? '' : 'disabled'}" onclick={search}>
		Search
	</button>
</div>

<style>
	.search-container
	{
		gap: 1.5em;
		width: 100%;
	}

	h1
	{
		color: #303037;
		font-size: 1.25em;
		font-family: Satoshi-Variable;
		font-weight: 500;
		line-height: 1.5em;
		margin-bottom: 0.5em;
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
		font-family: Satoshi-Variable;
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
		font-family: Satoshi-Variable;
		font-weight: 500;
		line-height: 1.5em;
		border-radius: 0.5em;
		margin-left: 0.2em;
	}

	.input input
	{
		width: 100%;
		border-color: rgb(219, 219, 232);
		border-width: 2px;
		background-color: rgb(251, 251, 253);
		padding: 0.4em 0.6em;
		font-family: Satoshi-Variable;
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
	}

	.button
	{
		cursor: pointer;
		border-width: 2px;
		font-family: Satoshi-Variable;
		font-weight: 475;
		line-height: 1.5em;
		border-radius: 1.5em;
		padding: 1em 4em;
		transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, color 0.2s ease-in-out;
		margin-top: 1em;
		background-color: rgb(122, 243, 191);
		border-color: rgb(86, 200, 162);
		color: rgb(27, 82, 78);
	}

	.button:hover
	{
		background-color: rgb(110, 231, 186);
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
</style>
