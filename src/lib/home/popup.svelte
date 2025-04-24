<script lang="ts">
	import { get_new_map_issue_url } from '$lib/github/issue';
	import Cross from '$lib/svgs/cross.svg';

	let shown = $state(false);
	let data = $state({
		title: '',
		description: '',
		papers: '',
		comment: '',
		discord_username: ''
	});
	let cooldown = $state(false);

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
				discord_username: ''
			};
		}
	}

	export function hide()
	{
		shown = false;
	}

	function submit_github()
	{
		if (cooldown)
			return;

		cooldown = true;
		const url = get_new_map_issue_url(data);

		setTimeout(() => { cooldown = false; }, 1000);
		window.open(url, '_self')?.focus();
	}

	async function submit()
	{
		if (cooldown)
			return;

		cooldown = true;

		let body: Record<string, string> = { 'title': data.title.trim() };

		if (data.description.trim().length > 0)
			body['description'] = data.description.trim();

		if (data.papers.trim().length > 0)
			body['papers'] = data.papers.trim();

		if (data.comment.trim().length > 0)
			body['comment'] = data.comment.trim();

		if (data.discord_username.trim().length > 0)
			body['discord_username'] = data.discord_username.trim();

		const response = await fetch(`/request/new`, {
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

			setTimeout(() => { cooldown = false; }, 1000);
			alert(error_message);
			return;
		}

		const result = await response.json() as { issue_url: string };

		setTimeout(() => { cooldown = false; }, 1000);
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
		<h1 class="unselectable">Request a new map</h1>
		<div class="input">
			<div class="label unselectable"><span>Title</span></div>
			<input bind:value={data.title} type="text" placeholder="A simple question that can be answered by science"/>
		</div>
		<div class="input">
			<div class="label unselectable">
				<span>Description</span>
				<span class="optional"><i>(optional)</i></span>
			</div>
			<input bind:value={data.description} type="text" placeholder="Provide additional details about the question"/>
		</div>
		<div class="input">
			<div class="label unselectable">
				<span>Papers</span>
				<span class="optional"><i>(optional)</i></span>
			</div>
			<textarea bind:value={data.papers} placeholder="Links to papers you have already found"></textarea>
		</div>
		<div class="input">
			<div class="label unselectable">
				<span>Additional comment</span>
				<span class="optional"><i>(optional)</i></span>
			</div>
			<input bind:value={data.comment} type="text" placeholder="Other useful information"/>
		</div>
		<div class="input">
			<div class="label unselectable">
				<span>Discord username</span>
				<span class="optional"><i>(optional)</i></span>
			</div>
			<input bind:value={data.discord_username} type="text" placeholder="For the &quot;Contributor&quot; role on the Papermap discord"/>
		</div>
		<div class="buttons flex-center-row img-unselectable">
			<button class="github-button flex-center-col {data.title.trim().length > 0 ? '' : 'disabled'}" onclick={submit_github}>
				Submit using your own GitHub account
			</button>
			<button class="default-button {data.title.trim().length > 0 ? '' : 'disabled'}" onclick={submit}>
				Submit
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
		font-family: Satoshi-Variable;
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
		font-family: Satoshi-Variable;
		font-weight: 500;
		line-height: 1.5em;
		border-radius: 0.5em;
		margin-left: 0.2em;
	}

	.label .optional
	{
		font-weight: 450;
		color: rgb(144, 144, 163);
	}

	.input input, .input textarea
	{
		width: 100%;
		border-color: rgb(219, 219, 232);
		border-width: 0.145em;
		background-color: rgb(251, 251, 253);
		padding: 0.4em 0.6em;
		font-family: Satoshi-Variable;
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
		font-family: Satoshi-Variable;
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
		background-color: rgb(133, 174, 255);
		border-color: rgb(91, 117, 219);
		color: rgb(49, 55, 91);
	}

	.github-button:hover
	{
		background-color: #7ca1f5;
	}

	.default-button
	{
		background-color: rgb(122, 243, 191);
		border-color: rgb(86, 200, 162);
		color: rgb(27, 82, 78);
	}

	.default-button:hover
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
</style>
