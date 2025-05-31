<script lang="ts">
	import type { Group, MapTitle } from '$lib/types/map';
	import Self from './maps.svelte'

	const { emojis, i, group, sub_groups, maps }: {
		emojis: Record<string, string>,
		i: number,
		group: Group | null,
		sub_groups: any[],
		maps: MapTitle[],
	} = $props();
</script>

{#snippet emoji(emoji: string)}
	<div class="emoji">{@html emojis[emoji]}</div>
{/snippet}

<div class="list flex flex-col justify-start items-start relative">
	<div class="group flex flex-col justify-start items-start">
		{#if group}
			<div class="group-header flex-center-row unselectable">
				{@render emoji(group.emoji)}
				<h2>{group.name}</h2>
			</div>
		{/if}
		{#each sub_groups as sub_group}
			<Self {emojis} i={i + 1} group={sub_group.group} sub_groups={[]} maps={sub_group.maps}/>
		{/each}
		<div class="maps flex flex-row justify-start items-start flex-wrap">
			{#each maps as map}
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
</div>

<style>
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
		font-family: Satoshi-Variable, sans-serif;
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
		font-family: Satoshi-Variable, sans-serif;
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
