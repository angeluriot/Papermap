<script lang="ts">
	import type { Journal } from '$lib/types/journal';
	import * as cards from './cards';
	import { float_to_text, int_to_text } from '../utils';
	import InfoBubble from './info_bubble.svelte';
	import { emoji_to_svg } from '../emojis';

	const { journal, width, height }: {
		journal: Journal,
		width: number,
		height: number
	} = $props();

	function color_to_shadow(color: string | undefined): string
	{
		return cards.color_to_shadow(color) + '50';
	}

	const metrics_data = {
		h: { name: 'H-index', description: 'The maximum value of H such that the journal has published H papers that have each been cited at least H times' },
		if: { name: 'Impact Factor', description: 'The average number of citations received this year by papers published in the journal during the last 2 years' },
		cs: { name: 'CiteScore', description: 'The average number of citations received in the last 4 years by papers published in the journal during the same period' },
		sjr: { name: 'SJR', description: '"SCImago Journal Rank": the average number of weighted citations received this year by papers published in the journal during the last 3 years' },
		snip: { name: 'SNIP', description: '"Source Normalized Impact per Paper": the average number of citations received in the last 3 years by papers published in the journal during the same period weighted by differences in citation practices between subject fields' },
		ef: { name: 'Eigenfactor', description: 'The percentage of time spent visiting the journal when randomly following citation links from papers published in the last 5 years' },
		ai: { name: 'Article Influence', description: 'The Eigenfactor Score divided by the number of papers published in the journal in the last 5 years' },
		self: { name: 'Self-citation', description: 'The percentage of citations to the journal that come from the journal itself' },
		rti: { name: 'RTI', description: `"Rigor & Transparency Index": the average SciScore for the journal's papers, reflecting how well they adhere to criteria such as randomization, blinding, power, transparency, and more` },
		top: { name: 'TOP Factor', description: '"Transparency and Openness Promotion Factor": a rating of journal policies assessing how strongly they promote transparency and reproducibility' },
		alt: { name: 'News Mentions', description: "The average number of news mentions of the journal's papers" },
	};

	const title = $derived(journal.titles[0]);
	const link = $derived.by(() =>
	{
		if (journal.link !== undefined)
			return journal.link;

		let query = (
			(journal.titles[0].trim() + ' Scientific Journal')
			.replace(/[^a-zA-Z\s]+/g, '')
			.trim()
			.replace(/[\s]+/g, '+')
		);

		return `http://www.google.com/search?q=${query}&btnI=I`;
	});
	const publisher = $derived(journal.publisher);

	const metrics = $derived.by(() =>
	{
		let results = []

		for (const metric of Object.keys(metrics_data) as (keyof typeof metrics_data)[])
		{
			const value = journal.metrics[metric];
			const score = journal.scores[metric];

			if (value === undefined || score === undefined)
				continue;

			results.push({
				title: metrics_data[metric].name,
				emoji: cards.score_to_emoji(metric === 'self' ? score * 0.7 : score),
				text: (
					metric === 'self' ?
					int_to_text(Math.round(value)) + '%' :
					float_to_text(value)
				),
				color: cards.score_to_color(metric === 'self' ? score * 0.8 : score),
				shadow: color_to_shadow(cards.score_to_color(score)),
				description: metrics_data[metric].description,
			});
		}

		return results;
	});
</script>

<div class="journal-container w-full flex flex-col justify-start items-start flex-nowrap">
	<a href={link} target="_blank" class="w-full" title={title}>
		<p class="title">{title}</p>
		<div class="publisher flex">
			<p class="publisher-text">{publisher}</p>
		</div>
	</a>
	{#if metrics.length > 0}
		<div class="part-1">
			{#each metrics as metric}
				<div class="subtitle-cards">
					<span class="subtitle unselectable">
						{metric.title}:
					</span>
					<div class="cards">
						<div class="card text-unselectable" style="background-color: {metric.color}; --shadow-color: {metric.shadow};">
							<img src={emoji_to_svg(metric.emoji)} alt={metric.emoji}/>
							<span>{metric.text}</span>
							<div class="info-ext">
								<InfoBubble text={metric.description} {width} {height}/>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.journal-container
	{
		gap: 0.9em;
	}

	p, span
	{
		font-family: Satoshi-Variable;
		line-height: 1.25em;
	}

	span
	{
		text-wrap: nowrap;
	}

	.title
	{
		font-family: Satoshi-Variable;
		font-size: 1.2em;
		line-height: 1.25em;
		font-weight: 725;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		line-clamp: 3;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		margin-bottom: 0.3em;
	}

	.publisher
	{
		font-weight: 575;
		color: #787a89;
		gap: 0.5em;
	}

	.publisher-text
	{
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		line-clamp: 1;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
	}

	.part-1
	{
		display: flex;
		flex-direction: row;
		justify-content: start;
		align-items: start;
		flex-wrap: wrap;
		gap: 1em 2em;
	}

	.subtitle-cards
	{
		display: flex;
		flex-direction: column;
		justify-content: start;
		align-items: start;
		flex-wrap: nowrap;
		gap: 0.3em;
	}

	.subtitle
	{
		font-size: 1.05em;
		font-weight: 600;
	}

	.cards
	{
		display: flex;
		flex-direction: row;
		justify-content: start;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.5em;
	}

	.card
	{
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		flex-wrap: nowrap;
		gap: 0.4em;
		max-width: calc(var(--details-width) - calc(var(--details-x-pad) * 2));
		position: relative;
		padding: 0.3em 0.75em 0.3em 0.65em;
		border-radius: calc(infinity * 1px);
		cursor: pointer;
	}

	.card img
	{
		height: 1.1em;
		filter: drop-shadow(0 0.025em 0.3em var(--shadow-color));
	}

	.card span
	{
		display: block;
		text-overflow: ellipsis;
		box-sizing: border-box;
		overflow: hidden;
		font-weight: 450;
		color: white;
		letter-spacing: 0.01em;
		text-shadow: 0 0.025em 0.3em var(--shadow-color);
	}

	.card .info-ext
	{
		position: absolute;
		display: none;
		left: 0;
		width: 100%;
	}

	.card:hover .info-ext
	{
		display: block;
	}
</style>
