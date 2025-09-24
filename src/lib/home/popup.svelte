<script lang="ts">
	import Loading from '$lib/display/loading.svelte';
	import { get_new_map_issue_url } from '$lib/github/issue';
	import Cross from '$lib/svgs/cross.svg';

	let shown = $state(false);
	let data = $state({
		title: '',
		description: '',
		papers: '',
		comment: '',
		discord_username: '',
	});
	let loading = $state(false);

	export function show(title?: string)
	{
		shown = true;

		if (title !== undefined && title.trim().length > 0)
		{
			data = {
				title: title.trim(),
				description: '',
				papers: '',
				comment: '',
				discord_username: '',
			};
		}
	}

	export function hide()
	{
		shown = false;
	}

	function submit_github()
	{
		if (loading)
			return;

		loading = true;
		const url = get_new_map_issue_url(data);

		window.open(url, '_self')?.focus();
	}

	async function submit()
	{
		if (loading)
			return;

		loading = true;

		const body: Record<string, string> = { 'title': data.title.trim() };

		if (data.description.trim().length > 0)
			body['description'] = data.description.trim();

		if (data.papers.trim().length > 0)
			body['papers'] = data.papers.trim();

		if (data.comment.trim().length > 0)
			body['comment'] = data.comment.trim();

		if (data.discord_username.trim().length > 0)
			body['discord_username'] = data.discord_username.trim();

		const response = await fetch('/request/new', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
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
				error_message = 'There is an issue with GitHub, please try again later.';

			if (response.status === 500)
				error_message = 'There is an issue with the server, please try again later.';

			alert(error_message);
			loading = false;
			return;
		}

		const result = await response.json() as { issue_url: string };

		window.open(result.issue_url, '_self')?.focus();
	}
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
		<h1>Request a new map</h1>
		<div class="input">
			<div class="label flex-center-row">
				<span>Title</span>
				<span class="required">*</span>
			</div>
			<input bind:value={data.title} type="text" placeholder="A simple question that can be answered by science"/>
		</div>
		<div class="input">
			<div class="label">
				<span>Description</span>
				<span class="optional"><i>(optional)</i></span>
			</div>
			<input bind:value={data.description} type="text" placeholder="Provide additional details about the question"/>
		</div>
		<div class="input">
			<div class="label">
				<span>Papers</span>
				<span class="optional"><i>(optional)</i></span>
			</div>
			<textarea bind:value={data.papers} placeholder="Links to papers you have already found"></textarea>
		</div>
		<div class="input">
			<div class="label">
				<span>Additional comment</span>
				<span class="optional"><i>(optional)</i></span>
			</div>
			<input bind:value={data.comment} type="text" placeholder="Other useful information"/>
		</div>
		<div class="input">
			<div class="label">
				<span>Discord username</span>
				<span class="optional"><i>(optional)</i></span>
			</div>
			<input bind:value={data.discord_username} type="text" placeholder="For the &quot;Contributor&quot; role on the Papermap discord"/>
		</div>
		<div class="buttons flex-center-row img-unselectable">
			<button
				class="github-button relative flex-center-col {loading || data.title.trim().length > 0 ? '' : 'disabled'}"
				style="{loading ? 'pointer-events: none;' : ''}" onclick={submit_github}
			>
				<span class="unselectable" style="{loading ? 'opacity: 0;' : ''}">
					Submit using your own GitHub account
				</span>
				{#if loading}
					<div class="loading">
						<Loading color="#31375b"/>
					</div>
				{/if}
			</button>
			<button
				class="default-button relative {loading || data.title.trim().length > 0 ? '' : 'disabled'}"
				style="{loading ? 'pointer-events: none;' : ''}" onclick={submit}
			>
				<span class="unselectable" style="{loading ? 'opacity: 0;' : ''}">
					Submit
				</span>
				{#if loading}
					<div class="loading">
						<Loading color="#1b524e"/>
					</div>
				{/if}
			</button>
		</div>
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
		gap: 1.5em;
		--padding-size: 3.5em;
		padding: calc(var(--padding-size) * 0.85) var(--padding-size) var(--padding-size) var(--padding-size);
		width: 35em;
		max-width: calc(100vw - 3em);
	}

	@media screen and (max-width: 430px)
	{
		.popup
		{
			--padding-size: 2.5em;
		}
	}

	.cross
	{
		border-radius: 1em;
		margin: 0.5em;
		padding: 0.8em;
		opacity: 0.5;
		transition: opacity 0.1s ease-in-out;
	}

	.cross:hover
	{
		opacity: 0.85;
	}

	.cross img
	{
		width: 1em;
		height: 1em;
	}

	h1
	{
		color: #303037;
		font-size: 1.25em;
		font-family: Satoshi-Variable, sans-serif;
		font-weight: 500;
		line-height: 1.5em;
		margin-bottom: 0.5em;
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

	.required
	{
		font-weight: 800;
		font-size: 1.3em;
		line-height: 0.5em;
		color: #ff2b2b;
		margin-bottom: 0.2em;
	}

	.label .optional
	{
		font-weight: 450;
		color: rgb(144, 144, 163);
	}

	.input input, .input textarea
	{
		width: 100%;
		border-color: #dbdbe8;
		border-width: 0.145em;
		background-color: #fbfbfd;
		padding: 0.4em 0.6em;
		font-family: Satoshi-Variable, sans-serif;
		font-weight: 465;
		line-height: 1.5em;
		border-radius: 0.5em;
		color: rgb(77, 77, 92);
	}

	.input textarea
	{
		resize: none;
		height: 8em;
	}

	.input input:focus, .input textarea:focus
	{
		outline: none;
		border-color: rgb(173, 173, 194);
		border-width: 0.145em;
	}

	.input input::placeholder, .input textarea::placeholder
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
		width: 100%;
		gap: 1.5em;
		margin-top: 1em;
	}

	button
	{
		cursor: pointer;
		max-width: 15em;
		border-width: 0.145em;
		font-family: Satoshi-Variable, sans-serif;
		font-weight: 475;
		line-height: 1.5em;
		border-radius: 1.5em;
		width: 100%;
		min-height: 4em;
		padding: 0.5em 1em;
		transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, color 0.2s ease-in-out;
	}

	.github-button
	{
		background-color: #85aeff;
		border-color: #5b75db;
		color: #31375b;
	}

	.github-button:hover
	{
		background-color: #7ca1f5;
	}

	.default-button
	{
		background-color: #7af3bf;
		border-color: #56c8a2;
		color: #1b524e;
	}

	.default-button:hover
	{
		background-color: #6ee7ba;
	}

	.disabled
	{
		pointer-events: none;
		background-color: #f0f0f7;
		border-style: dashed;
		border-color: #d3d4e8;
		color: #9b9bb7;
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
