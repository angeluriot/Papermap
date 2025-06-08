<script lang="ts">
	import type { PageProps } from './$types';
	import { constants as C } from '$lib/utils';
	import Background from '$lib/list/background.svelte';
	import Home from '$lib/svgs/home.svg';
	import Random from '$lib/svgs/random.svg';
	import Maps from '$lib/list/maps.svelte';

	const { data }: PageProps = $props();

	const emojis = data.emojis;
	const title = 'Papermap maps';
	const description = 'A list of all maps currently available on Papermap.';
	const preview = `${C.BASE_URL}/images/preview.png`;
	const tags = C.DEFAULT_TAGS.concat(['maps', 'list']);
	const page_url = `${C.BASE_URL}/maps`;
	let width = $state(0);
	let height = $state(0);
	let page_height = $state(0);
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height}/>

{#snippet emoji(emoji: string)}
	<div class="emoji">{@html emojis[emoji]}</div>
{/snippet}

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description}/>
	<meta name="keywords" content={tags.join(', ')}/>
	<meta name="subject" content={title}/>
	<meta name="topic" content={title}/>
	<meta name="summary" content={description}/>
	<meta name="url" content={page_url}/>
	<meta name="pagename" content={title}/>

	<meta property="og:title" content={title}/>
	<meta property="og:url" content={page_url}/>
	<meta property="og:image" content={preview}/>
	<meta property="og:image:url" content={preview}/>
	<meta property="og:image:secure_url" content={preview}/>
	<meta property="og:image:width" content=1200/>
	<meta property="og:image:height" content=630/>
	<meta property="og:description" content={description}/>
	<meta property="article:tag" content={tags.join(', ')}/>

	<meta name="twitter:title" content={title}/>
	<meta name="twitter:description" content={description}/>
	<meta name="twitter:image" content={preview}/>
	<meta name="twitter:image:src" content={preview}/>
	<meta name="twitter:image:alt" content={title}/>
	<meta name="twitter:url" content={page_url}/>
</svelte:head>

<div class="page-container absolute flex flex-col justify-start items-center w-full h-full overflow-x-hidden bg-[#f3f4ff]">
	<div class="absolute z-0">
		<Background {width} {height} {page_height}/>
	</div>
	<div class="main flex-center-col" bind:clientHeight={page_height}>
		<div class="header w-full flex flex-row justify-between items-start">
			<div class="title flex-center-row unselectable">
				{@render emoji('📖')}
				<h1>All maps</h1>
			</div>
			<div class="links flex-center-row">
				<a href="/maps/random">
					<img src={Random} alt="Random map" title="Random map" class="img-unselectable"/>
				</a>
				<a href="/">
					<img src={Home} alt="Home" title="Home" class="img-unselectable"/>
				</a>
			</div>
		</div>
		<div class="list flex flex-col justify-start items-start w-full">
			{#each data.maps_structure as node}
				<Maps {emojis} {node}/>
			{/each}
		</div>
	</div>
</div>

<style>
	.page-container
	{
		font-size: clamp(11px, calc(calc(0.15vw + 5px) * 2), 16px);
		padding: 2em 0em;
	}

	.main
	{
		gap: 4em;
		width: 60em;
		max-width: calc(100vw - 6em);
	}

	.header
	{
		font-size: 1.85em;
		font-family: Satoshi-Variable, sans-serif;
		font-weight: 550;
		line-height: 1.25em;
		text-wrap: nowrap;
		color: #303037;
		gap: 0.3em;
		margin-top: 0.5em;
		margin-bottom: -0.2em;
	}

	.title
	{
		gap: 0.3em;
	}

	.links
	{
		gap: 0.6em;
		margin-top: -0.2em;
		filter: drop-shadow(0em 0.1em 0.5em #00008036);
	}

	.links img
	{
		width: 1.9em;
		height: 1.9em;
		transition: transform 0.2s ease-in-out;
	}

	.links img:hover
	{
		transform: scale(1.06);
	}

	.links img:active
	{
		transition: none;
		transform: scale(1);
	}

	@media screen and (max-width: 375px)
	{
		.main
		{
			max-width: calc(100vw - 4em);
		}
	}

	.emoji
	{
		width: 1.15em;
		height: 1.15em;
	}
</style>
