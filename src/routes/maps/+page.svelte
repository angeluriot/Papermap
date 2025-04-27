<script lang="ts">
	import type { PageProps } from './$types';
	import { constants as C } from '$lib/utils';
	import type { MapTitle } from '$lib/types/map';
	import Background from '$lib/home/background.svelte';
	import Home from '$lib/svgs/home.svg';
	import Random from '$lib/svgs/random.svg';

	const { data }: PageProps = $props();

	const emojis = data.emojis;
	const title = 'All maps';
	const description = 'A list of all maps currently available on Papermap.';
	const preview = `${C.BASE_URL}/images/preview.png`;
	const tags = C.DEFAULT_TAGS.concat(['maps', 'list']);
	const page_url = `${C.BASE_URL}/maps`;
	let width = $state(0);
	let height = $state(0);

	let map_dict = $derived.by(() =>
	{
		let res: Record<string, { group: { id: string, emoji: string, name: string }, maps: MapTitle[] }> = {};

		for (const map of data.maps)
		{
			if (!res[map.group.id])
				res[map.group.id] = { group: map.group, maps: [] };

			res[map.group.id].maps.push(map);
		}

		let res_list = Object.values(res).toSorted((a, b) =>
		{
			if (a.group.name < b.group.name)
				return -1;
			if (a.group.name > b.group.name)
				return 1;
			return 0;
		});

		for (let group of res_list)
		{
			group.maps = group.maps.toSorted((a, b) =>
			{
				if (a.question.short < b.question.short)
					return -1;
				if (a.question.short > b.question.short)
					return 1;
				return 0;
			});
		}

		return res_list;
	});
</script>

<svelte:window bind:innerWidth={width}/>
<svelte:body bind:clientHeight={height}/>

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

<div class="page-container flex-center-col w-full overflow-hidden relative bg-[#f3f4ff]">
	<div class="page-background absolute z-0">
		<Background {width} {height}/>
	</div>
	<div class="list flex flex-col justify-start items-start relative">
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
		{#each map_dict as group}
			<div class="group flex flex-col justify-start items-start">
				<div class="group-header flex-center-row unselectable">
					{@render emoji(group.group.emoji)}
					<h2>{group.group.name}</h2>
				</div>
				<div class="maps flex flex-row justify-start items-start flex-wrap">
					{#each group.maps as map}
						<div class="map flex-center-col" title={map.question.long}>
							<a href={map.url}>
								<img src="{map.url}/thumbnail.webp?v={map.hash}" alt={map.question.short} class="thumbnail img-unselectable"/>
							</a>
							<a href={map.url}>
								<div class="img-unselectable">
									{@render emoji(map.emoji)}
									<span>&nbsp;&nbsp;&nbsp;&thinsp;&thinsp;&thinsp;{map.question.short}</span>
								</div>
							</a>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.page-container
	{
		font-size: clamp(11px, calc(calc(0.15vw + 5px) * 2), 16px);
		padding: 2em 0em;
	}

	.header
	{
		font-size: 1.85em;
		font-family: Satoshi-Variable;
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

	.list
	{
		gap: 5em;
		max-width: 84.5em;
		--thumbnail-width: 20em;
		margin-bottom: 4em;
	}

	@media screen and (max-width: 1400px) { .list { max-width: 63em; } }

	@media screen and (max-width: 900px)
	{
		.list
		{
			max-width: 41.5em;
		}
	}

	@media screen and (max-width: 550px)
	{
		.list
		{
			--thumbnail-width: calc(50vw - 3.5em);
			max-width: calc(calc(var(--thumbnail-width) * 2) + 1.5em);
		}
	}

	@media screen and (max-width: 490px)
	{
		.page-container
		{
			padding: 1.5em 0em;
		}

		.list
		{
			--thumbnail-width: calc(50vw - 3em);
			max-width: calc(calc(var(--thumbnail-width) * 2) + 1.5em);
		}
	}

	@media screen and (max-width: 320px) { .list { max-width: 20em; --thumbnail-width: 20em; } }

	.group
	{
		gap: 1em;
	}

	.group-header
	{
		font-size: 1.3em;
		gap: 0.3em;
	}

	.emoji
	{
		width: 1.15em;
		height: 1.15em;
	}

	h2
	{
		display: block;
		font-family: Satoshi-Variable;
		font-weight: 625;
		line-height: 1.25em;
		text-wrap: wrap;
		color: #303037;
	}

	.thumbnail
	{
		border-radius: 1em;
		width: var(--thumbnail-width);
		transition: opacity 0.2s ease-in-out;
	}

	.maps
	{
		gap: 1.5em;
	}

	.map
	{
		gap: 0.5em;
		filter: drop-shadow(0 0em 0.6em #00008025);
	}

	.map .emoji
	{
		margin-bottom: -1.15em;
	}

	.map span
	{
		display: block;
		width: var(--thumbnail-width);
		font-family: Satoshi-Variable;
		font-weight: 550;
		line-height: 1.25em;
		text-wrap: wrap;
		color: #303037;
	}

	.map:hover span
	{
		text-decoration: underline;
	}
</style>
