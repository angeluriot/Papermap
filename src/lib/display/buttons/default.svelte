<script lang="ts">
	import Edit from '$lib/svgs/edit.svg';
	import Download from '$lib/svgs/download.svg';
	import Png from '$lib/svgs/png.svg';
	import Svg from '$lib/svgs/svg.svg';
	import Csv from '$lib/svgs/csv.svg';
	import Txt from '$lib/svgs/txt.svg';
	import TxtCopied from '$lib/svgs/txt-copied.svg';
	import Info from '$lib/display/buttons/info.svelte';
	import type { Map } from '$lib/types/map';

	let { map, hash, edit_mode = $bindable() }: { map: Map, hash: string, edit_mode: boolean } = $props();

	const file_name = map.question.short.toLowerCase().replace(/\s+/g, '-').replace('?', '').replace('.', '');
	const file_url = `/maps/${map.id}/`;
	let copied = $state(false);
	let timeouts: NodeJS.Timeout[] = $state([]);

	async function put_in_clipboard()
	{
		for (const timeout of timeouts)
			clearTimeout(timeout);

		timeouts = [];
		copied = true;

		const papers = (
			Object.values(map.papers)
			.toSorted((a, b) => b.score - a.score)
			.map((paper) => `"${paper.quote}"\n${paper.link}`)
			.join('\n\n')
		);

		const title = (map.description.endsWith('.') ? map.description.slice(0, -1) : map.description) + ':\n\n';
		await navigator.clipboard.writeText(title + papers);

		timeouts.push(setTimeout(() => { copied = false; }, 2000));
	}
</script>

<div class="button-container right-0 bottom-0 flex-center-col">
	<div class="relative">
		<img src={Download} alt="Download" class="button relative download-button rounded-full img-unselectable">
		<div class="download-details absolute">
			<div class="hitbox hitbox-1 absolute"></div>
			<div class="hitbox hitbox-2 absolute"></div>
			<div class="arrow absolute"></div>
			<div class="bubble absolute flex-center-col">
				<div class="sub-button relative">
					<a href={file_url + 'image.png?v=' + hash} download={file_name + '.png'}>
						<img src={Png} alt="PNG" class="img-unselectable">
					</a>
					<Info text="Download a PNG image of this page" width={11} distance={3.6} />
				</div>
				<div class="sub-button relative">
					<a href={file_url + 'image.svg?v=' + hash} download={file_name + '.svg'}>
						<img src={Svg} alt="SVG" class="img-unselectable">
					</a>
					<Info text="Download an SVG vector graphic of this page" width={14} distance={3.6} />
				</div>
				<div class="sub-button relative">
					<a href={file_url + 'data.csv?v=' + hash} download={file_name + '.csv'}>
						<img src={Csv} alt="CSV" class="img-unselectable">
					</a>
					<Info text="Download the data of this page in a CSV file" width={13} distance={3.6} />
				</div>
				<div class="sub-button relative">
					<button onclick={put_in_clipboard}>
						{#if copied}
							<img src={TxtCopied} alt="Text copied" class="img-unselectable">
						{:else}
							<img src={Txt} alt="Text" class="img-unselectable">
						{/if}
					</button>
					{#if copied}
						<Info text="Text copied!" width={6} distance={3.6} />
					{:else}
						<Info text="Copy a text version of this page" width={11.5} distance={3.6} />
					{/if}
				</div>
			</div>
		</div>
	</div>
	<div class="relative edit-button-container z-100" onclick={() => { edit_mode = true; }} onkeydown={null} role="button" tabindex={1}>
		<img src={Edit} alt="Edit" class="button relative edit-button rounded-full img-unselectable"/>
		<Info title="Edit Mode" text="Add, remove or edit papers" width={15} distance={3.2} y_shift={-0.5} />
	</div>
</div>

<style>
	.button-container
	{
		gap: 0.9em;
		margin: 1.5em 1.3em;
	}

	.download-button, .edit-button-container
	{
		filter: drop-shadow(0em 0.1em 1.4em #00008041);
		transform: translateZ(0);
	}

	.button
	{
		cursor: pointer;
		transition: transform 0.2s ease-in-out;
		width: 3.6em;
		height: 3.6em;
		z-index: 102;
	}

	.button:hover, .sub-button img:hover
	{
		transform: scale(1.06);
	}

	.button:active, .sub-button img:active
	{
		transition: none;
		transform: scale(1);
	}

	.hitbox
	{
		opacity: 0;
		transform: translate(-100%, -50%);
		border-radius: 2em;
		background-color: white;
	}

	.hitbox-1
	{
		width: 6em;
		height: 8.5em;
		left: -0.25em;
		top: -1.25em;
	}

	.hitbox-2
	{
		width: 4em;
		height: 14em;
		left: -2em;
		top: -1.75em;
	}

	.download-details
	{
		display: none;
		left: 50%;
		top: 50%;
		filter: drop-shadow(0 0.1em 1em #00008036);
		transform: translateZ(0);
		z-index: 100;
	}

	.download-button:hover ~ .download-details,
	.download-details:hover
	{
		display: block;
	}

	.arrow
	{
		background-color: white;
		width: 2.5em;
		height: 2.5em;
		left: -4em;
		transform-origin: 0 0;
		transform: rotate(45deg) translate(-50%, -50%);
		border-radius: 0.4em;
	}

	.bubble
	{
		background-color: white;
		left: -3.3em;
		top: -2em;
		transform: translate(-100%, -50%);
		border-radius: 1.2em;
		gap: 0.85em;
		padding: 0.85em;
	}

	.sub-button, .edit-button-container
	{
		--info-display: none;
	}

	.sub-button:hover, .edit-button-container:has(.edit-button:hover)
	{
		--info-display: block;
	}

	.sub-button img
	{
		cursor: pointer;
		transition: transform 0.2s ease-in-out;
		width: 3.1em;
		height: 3.1em;
		max-width: none;
	}
</style>
