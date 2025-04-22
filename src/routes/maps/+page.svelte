<script lang="ts">
	import type { PageProps } from './$types';
	import { constants as C } from '$lib/utils';
	import type { MapTitle } from '$lib/types/map';
	import { emoji_to_svg } from '$lib/display/emojis';

	const { data }: PageProps = $props();

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

<svelte:window bind:innerWidth={width} bind:innerHeight={height}/>

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

<div class="page-container flex-center-col w-full bg-[#f3f4ff]">
	<div class="list flex flex-col justify-start items-start">
		<div class="header w-full flex flex-row justify-between items-center">
			<div class="title flex-center-row unselectable">
				<img src={emoji_to_svg('📖')} alt="📖" class="emoji"/>
				<h1>All maps</h1>
			</div>
			<div class="links flex-center-row">
				<a href="/maps/random">
					<img src={emoji_to_svg('🎲')} alt="🎲" title="Random map" class="emoji img-unselectable"/>
				</a>
				<a href="/">
					<img src={emoji_to_svg('🏠')} alt="🏠" title="Home" class="emoji img-unselectable"/>
				</a>
			</div>
		</div>
		{#each map_dict as group}
			<div class="group flex flex-col justify-start items-start">
				<div class="group-header flex-center-row unselectable">
					<img src={emoji_to_svg(group.group.emoji)} alt={group.group.emoji} class="emoji"/>
					<h2>{group.group.name}</h2>
				</div>
				<div class="maps flex flex-row justify-start items-start flex-wrap">
					{#each group.maps as map}
						<div class="map flex-center-col">
							<a href={map.url}>
								<img src="{map.url}/thumbnail.webp?v={map.hash}" alt={map.question.short} class="thumbnail img-unselectable"/>
							</a>
							<a href={map.url}>
								<div class="img-unselectable">
									<img src={emoji_to_svg(map.emoji)} alt={map.emoji} class="emoji"/>
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
		font-size: 1.75em;
		font-family: Satoshi-Variable;
		font-weight: 550;
		line-height: 1.25em;
		text-wrap: nowrap;
		color: #303037;
		gap: 0.3em;
		margin-bottom: -0.5em;
	}

	.title
	{
		gap: 0.3em;
	}

	.links
	{
		gap: 0.5em;
	}

	.links img
	{
		transition: opacity 0.2s ease-in-out;
	}

	.links img:hover
	{
		opacity: 0.75;
	}

	.list
	{
		gap: 4em;
		max-width: 84.5em;
		--thumbnail-width: 20em;
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
