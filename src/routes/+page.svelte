<script lang="ts">
	import type { PageProps } from './$types';
	import Background from '$lib/home/background.svelte';
	import Popup from '$lib/home/popup.svelte';
	import Search from '$lib/home/search.svelte';
	import Logo from '$lib/svgs/logo.svg';
	import Title from '$lib/svgs/title.svg';
	import { constants as C } from '$lib/utils';
	import { onMount } from 'svelte';

	const { data }: PageProps = $props();

	const emojis = data.emojis;
	const title = 'Papermap';
	const description = 'Get an overview of scientific literature findings on a wide range of questions.';
	const preview = `${C.BASE_URL}/images/preview.png`;
	let width = $state(0);
	let height = $state(0);
	let placeholder: string = $state('');
	let search = $state('');
	let search_element: Search | undefined = $state();
	let popup: Popup | undefined = $state();
	let interval: NodeJS.Timeout | undefined = $state();

	onMount(() =>
	{
		const params = new URLSearchParams(window.location.search);

		if (params.get('request') !== null)
		{
			const title = params.get('title') ?? '';
			popup?.show(title);
			window.history.replaceState({}, '', window.location.pathname);
		}
	});

	function get_placeholder()
	{
		try
		{
			let new_placeholder = data.maps[Math.floor(Math.random() * data.maps.length)].question.short;

			if (!data.maps.every((map) => map.question.short === new_placeholder))
				while (new_placeholder === placeholder)
					new_placeholder = data.maps[Math.floor(Math.random() * data.maps.length)].question.short;

			placeholder = new_placeholder;
		}

		catch
		{
			clearInterval(interval);
		}
	}

	onMount(() =>
	{
		get_placeholder();
		interval = setInterval(get_placeholder, 2000);
	});
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} onclick={() => search_element?.deselect()}/>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description}/>
	<meta name="keywords" content={C.DEFAULT_TAGS.join(', ')}/>
	<meta name="subject" content={title}/>
	<meta name="topic" content={title}/>
	<meta name="summary" content={description}/>
	<meta name="url" content={C.BASE_URL}/>
	<meta name="pagename" content={title}/>

	<meta property="og:title" content={title}/>
	<meta property="og:url" content={C.BASE_URL}/>
	<meta property="og:image" content={preview}/>
	<meta property="og:image:url" content={preview}/>
	<meta property="og:image:secure_url" content={preview}/>
	<meta property="og:image:width" content=1200/>
	<meta property="og:image:height" content=630/>
	<meta property="og:description" content={description}/>
	<meta property="article:tag" content={C.DEFAULT_TAGS.join(', ')}/>

	<meta name="twitter:title" content={title}/>
	<meta name="twitter:description" content={description}/>
	<meta name="twitter:image" content={preview}/>
	<meta name="twitter:image:src" content={preview}/>
	<meta name="twitter:image:alt" content={title}/>
	<meta name="twitter:url" content={C.BASE_URL}/>
</svelte:head>

<div class="page-container">
	<div class="absolute z-10 left-0 top-0 w-full h-full overflow-hidden flex-center-col">
		<div class="title flex-center-row unselectable mb-[0.8em]">
			<img src={Logo} alt="Logo" class="logo"/>
			<img src={Title} alt="Papermap" class="title-text"/>
		</div>
		<div
			class="input-container relative"
			onclick={(event) => { search_element?.select(); event.stopPropagation(); }}
			onkeydown={null} role="button" tabindex={0}
		>
			<input
				type="text" placeholder="{placeholder}" bind:value={search}
				class="rounded-full relative bg-white mb-[1.7em] z-20"
				style="{search_element?.shown() ? 'border-radius: 1.6em 1.6em 0em 0em;' : 'border-radius: 1.6em;'}"
			>
			<div class="search absolute w-full bg-white z-30" style="display: {search_element?.shown() ? 'block' : 'none'};">
				<Search {emojis} map={null} maps={data.maps} {search} new_map={(title) => popup?.show(title)} bind:this={search_element}/>
			</div>
		</div>
		<div class="buttons flex-center-row flex-wrap" style="{search_element?.shown() ? '' : 'position: relative; z-index: 40;'}">
			<a href="/maps" class="rounded-full">
				<button class="flex-center-row rounded-full unselectable">
					<div class="emoji">{@html emojis['📖']}</div>
					<span>All maps</span>
				</button>
			</a>
			<a href="/maps/random" class="rounded-full">
				<button class="flex-center-row rounded-full unselectable">
					<div class="emoji">{@html emojis['🎲']}</div>
					<span>Random map</span>
				</button>
			</a>
			<a href="/statistics" class="rounded-full">
				<button class="flex-center-row rounded-full unselectable">
					<div class="emoji">{@html emojis['📊']}</div>
					<span>Statistics</span>
				</button>
			</a>
		</div>
	</div>
	<div class="links absolute z-20 right-0 bottom-0 flex-center-row flex-wrap">
		<span onclick={() => popup?.show()} onkeydown={null} role="button" tabindex={0}>
			New map
		</span>
		<a href="https://github.com/angeluriot/Papermap/blob/main/doc/contribute/README.md" target="_blank">
			<span>Contribute</span>
		</a>
		<a href="https://discord.gg/eFdjRJe7WZ" target="_blank">
			<span>Discord</span>
		</a>
		<a href="https://github.com/angeluriot/Papermap" target="_blank">
			<span>GitHub</span>
		</a>
		<a href="https://linktr.ee/angeluriot" target="_blank">
			<span>Contact</span>
		</a>
	</div>
	<div class="absolute left-0 top-0 w-full h-full overflow-hidden unselectable">
		<Background {width} {height}/>
	</div>
	<Popup bind:this={popup}/>
</div>

<style>
	.page-container
	{
		font-size: clamp(11px, calc(calc(0.15vw + 5px) * 2), 16px);
	}

	.title
	{
		font-size: max(min(4.5em, 12vw), 30px);
		gap: 0.45em;
	}

	.logo
	{
		width: 1.15em;
	}

	.title-text
	{
		width: 4.4em;
		margin-bottom: -0.25em;
	}

	.input-container
	{
		filter: drop-shadow(0em 0em 3em #00008036);
		transform: translateZ(0);
	}

	input
	{
		width: 50em;
		max-width: calc(100vw - 4em);
		padding: 0.85em 1.45em;
		font-family: Satoshi-Variable, sans-serif;
		font-weight: 525;
		line-height: 1.5em;
		letter-spacing: 0.005em;
	}

	input::placeholder
	{
		color: #9b9aa7;
		pointer-events: none;
		user-select: none;
		-moz-user-select: none;
		-webkit-user-drag: none;
		-webkit-user-select: none;
		-ms-user-select: none;
		-o-user-select: none;
	}

	.search
	{
		padding: 0em 0em 0.4em 0em;
		left: 0em;
		top: 3em;
		border-radius: 0em 0em 1.6em 1.6em;
		overflow: hidden;
	}

	.buttons
	{
		font-size: 1.02em;
		gap: 1em 1.7em;
		margin-bottom: 13em;
		margin-left: 1em;
		margin-right: 1em;
	}

	@media screen and (max-height: 1000px) { .buttons { margin-bottom: 11em; } }
	@media screen and (max-height: 900px) { .buttons { margin-bottom: 9em; } }
	@media screen and (max-height: 800px) { .buttons { margin-bottom: 7em; } }
	@media screen and (max-height: 700px) { .buttons { margin-bottom: 5em; } }
	@media screen and (max-height: 500px) { .buttons { margin-bottom: 3em; } }
	@media screen and (max-height: 300px) { .buttons { margin-bottom: 1em; } }

	.buttons button
	{
		gap: 0.5em;
		padding: 0.7em 1.2em;
		background-color: white;
		box-shadow: 0em 0.1em 2em #00008040;
		transition: background-color 0.2s ease-in-out;
	}

	.buttons a:hover button
	{
		background-color: #f4f5fa;
	}

	.buttons button .emoji
	{
		width: 1.15em;
		height: 1.15em;
	}

	.buttons button span
	{
		font-family: Satoshi-Variable, sans-serif;
		font-weight: 550;
		line-height: 1.25em;
		text-wrap: nowrap;
		color: #303037;
	}

	.links
	{
		max-width: 100vw;
		margin: 1.4em 1.9em;
		gap: 1em;
	}

	.links span
	{
		padding: 0.5em 0.5em;
		cursor: pointer;
		color: #303037;
		font-family: Satoshi-Variable, sans-serif;
		font-weight: 475;
		line-height: 1.5em;
		text-wrap: nowrap;
	}

	.links span:hover
	{
		text-decoration: underline;
	}
</style>
