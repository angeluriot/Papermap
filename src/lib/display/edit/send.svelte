<script lang="ts">
	import Loading from '../loading.svelte';
	import Link from '$lib/svgs/link.svg';
	import { Edit, type Paper, paper_to_datapaper } from '$lib/types/paper';
	import { constants as C } from '$lib/utils';

	let { route, papers, comment = $bindable(), discord_username = $bindable(), leaving_message = $bindable(), github_enabled }: {
		route: string,
		papers: { [uuid: string]: Paper },
		comment: string,
		discord_username: string,
		leaving_message: boolean,
		github_enabled: boolean,
	} = $props();

	const local = C.DEV;

	let loading = $state(false);

	async function submit(local: boolean)
	{
		if (loading)
			return;

		loading = true;
		const body: any = { edits: { added: [], edited: {}, deleted: [] } };

		for (const paper of Object.values(papers))
		{
			if (paper.edit === Edit.Added)
				body.edits.added.push(paper_to_datapaper(paper));
			else if (paper.edit === Edit.Edited)
				body.edits.edited[paper.uuid] = paper_to_datapaper(paper);
			else if (paper.edit === Edit.Deleted)
				body.edits.deleted.push(paper.uuid);
		}

		if (comment.trim().length > 0)
			body.comment = comment.trim();

		if (discord_username.trim().length > 0)
			body.discord_username = discord_username.trim();

		const response = await fetch(`/${route}/edit${local ? '?local' : ''}`, {
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

		const result = await response.json() as { pr_url?: string };

		if (!local)
		{
			if (result.pr_url === undefined)
			{
				alert('An unknown error occurred.');
				loading = false;
				return;
			}

			leaving_message = false;
			window.open(result.pr_url, '_self')?.focus();
			return;
		}

		leaving_message = false;
		window.location.reload();
	}
</script>

<div class="send-container flex-center-col">
	<div class="title flex-center-col">
		<h1>Submit your changes</h1>
		<a href="https://github.com/angeluriot/Papermap/blob/main/doc/contribute/README.md" target="_blank" class="help flex-center-row">
			<img src={Link} alt="link" class="img-unselectable"/>
			<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;How to contribute?</span>
		</a>
	</div>
	<div class="input">
		<div class="label">
			<span>Comment</span>
			<span class="optional"><i>(optional)</i></span>
		</div>
		<textarea bind:value={comment} placeholder="Explain some choices or provide additional information"></textarea>
	</div>
	<div class="input">
		<div class="label">
			<span>Discord username</span>
			<span class="optional"><i>(optional)</i></span>
		</div>
		<input bind:value={discord_username} type="text" placeholder="For the &quot;Contributor&quot; role on the Papermap Discord server"/>
	</div>
	<div class="buttons w-full flex-center-row text-nowrap" style="{local ? 'justify-content: space-evenly;' : ''}">
		<button
			class="button submit-button relative flex-center-col {!github_enabled ? 'disabled' : ''}"
			style="{local ? '' : 'padding: 1em 4em;'} {!github_enabled || loading ? 'pointer-events: none;' : ''}"
			onclick={async () => await submit(false)}
		>
			<span class="unselectable" style="{github_enabled && loading ? 'opacity: 0;' : ''}">
				Submit
			</span>
			{#if github_enabled && loading}
				<div class="loading">
					<Loading color="#1b524e"/>
				</div>
			{/if}
		</button>
		{#if local}
			<button
				class="button local-button relative flex-center-col"
				style="{loading ? 'pointer-events: none;' : ''}"
				onclick={async () => await submit(true)}
			>
				<span class="unselectable" style="{loading ? 'opacity: 0;' : ''}">
					Apply locally
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
	.send-container
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
		color: var(--text-primary);
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

	.input
	{
		width: 100%;
		max-width: calc(100vw - 3em);
		display: flex;
		flex-direction: column;
		justify-content: start;
		align-items: start;
		color: var(--text-primary);
	}

	.input .label
	{
		font-family: Satoshi-Variable, sans-serif;
		font-weight: 500;
		line-height: 1.5em;
		border-radius: 0.5em;
		margin-left: 0.2em;
	}

	.input input, .input textarea
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

	.input input:focus, .input textarea:focus
	{
		outline: none;
		border-color: rgb(173, 173, 194);
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

	.input textarea
	{
		resize: none;
		height: 8em;
	}

	.label .optional
	{
		font-weight: 450;
		color: rgb(144, 144, 163);
		font-style: italic;
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

	.submit-button
	{
		background-color: rgb(122, 243, 191);
		border-color: rgb(86, 200, 162);
		color: rgb(27, 82, 78);
	}

	.submit-button:hover
	{
		background-color: rgb(110, 231, 186);
	}

	.local-button
	{
		background-color: rgb(133, 174, 255);
		border-color: rgb(91, 117, 219);
		color: rgb(49, 55, 91);
	}

	.local-button:hover
	{
		background-color: #7ca1f5;
	}

	@media screen and (max-width: 1100px)
	{
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

	.disabled
	{
		pointer-events: none;
		background-color: #f0f0f7;
		border-style: dashed;
		border-color: #d3d4e8;
		color: #9b9bb7;
	}
</style>
