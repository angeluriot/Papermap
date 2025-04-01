<script lang="ts">
	import { COLORS, Color } from '$lib/colors';
	import type { Journal } from '$lib/types/journal';
	import type { Map } from '$lib/types/map';
	import { JournalStatus, type Paper, StudyOn } from '$lib/types/paper';
	import * as cards from './cards';
	import { float_to_text, int_to_text } from '../utils';
	import InfoBubble from './info_bubble.svelte';
    import { de } from '@faker-js/faker';

	const { journal, width, height }: {
		journal: Journal,
		width: number,
		height: number
	} = $props();

	const metrics_data = {
		h: { name: 'H-index', description: 'The maximum value of H such that the journal has published H papers that have each been cited at least H times' },
		if: { name: 'Impact Factor', description: 'The average number of citations received this year by papers published in the journal during the last 2 years' },
		cs: { name: 'CiteScore', description: 'The average number of citations received in the last 4 years by papers published in the journal during the same period' },
		sjr: { name: 'SJR', description: '"SCImago Journal Rank": the average number of weighted citations received this year by papers published in the journal during the last 3 years' },
		snip: { name: 'SNIP', description: '"Source Normalized Impact per Paper": the average number of citations received in the last 3 years by papers published in the journal during the same period weighted by differences in citation practices between subject fields' },
		ef: { name: 'Eigenfactor Score', description: 'The percentage of time spent visiting the journal when randomly following citation links from papers published in the last 5 years' },
		ai: { name: 'Article Influence Score', description: 'The Eigenfactor Score divided by the number of papers published in the journal in the last 5 years' },
		self: { name: 'Self-citation rate', description: 'The percentage of citations to the journal that come from the journal itself' },
		rti: { name: 'RTI', description: `"Rigor & Transparency Index": the average SciScore for the journal's papers, reflecting how well they adhere to criteria such as randomization, blinding, power, transparency, and more` },
		top: { name: 'TOP Factor', description: '"Transparency and Openness Promotion Factor": a rating of journal policies assessing how strongly they promote transparency and reproducibility' },
		alt: { name: 'News Mentions', description: "the average number of news mentions of the journal's papers" },
	};

	const title = $derived(journal.titles[0]);
	const link = $derived(journal.link);
	const publisher = $derived(journal.publisher);

	const metrics = $derived.by(() =>
	{
		let results = []

		for (const metric of Object.keys(metrics_data) as (keyof typeof metrics_data)[])
		{
			if (journal.metrics[metric] === undefined)
				continue;

			results.push({
				text: cards.score_to_emoji(journal.scores[metric]) + ' ' + float_to_text(journal.metrics[metric]),
				color: cards.score_to_color(journal.scores[metric]),
				description: metrics_data[metric].description,
			});
		}

		return results;
	});
</script>

<div class="w-full flex flex-col justify-start items-start flex-nowrap">
	<a href={link} target="_blank">
		<p class="title">{title}</p>
		<div class="publisher flex">
			<span>{publisher}</span>
		</div>
	</a>
	<div class="part-1">
		{#if paper_type_parts.length > 0}
			<div class="subtitle-cards">
				<span class="subtitle unselectable">
					Paper type:
				</span>
				<div class="cards">
					{#each paper_type_parts as part}
						{#if part.color}
							<div class="card text-unselectable" style="background-color: {part.color};">
								<span>{part.text}</span>
								{#if part.description}
									<div class="info-ext">
										<InfoBubble text={part.description} {width} {height}/>
									</div>
								{/if}
							</div>
						{:else}
							<div class="text unselectable">
								<span>{part.text}</span>
							</div>
						{/if}
					{/each}
				</div>
			</div>
		{/if}
		<div class="subtitle-cards">
			<span class="subtitle unselectable">Journal:</span>
			<div class="cards">
				<div class="card text-unselectable" style="background-color: {journal.color};">
					<span>{journal.text}</span>
					<div class="info-ext">
						<InfoBubble text="WIP" {width} {height}/>
					</div>
				</div>
				{#if retracted}
					<div class="card text-unselectable" style="background-color: {COLORS[Color.Red].default};">
						<span>😵 Retracted</span>
						<div class="info-ext">
							<InfoBubble text="This paper has been retracted by the journal" {width} {height}/>
						</div>
					</div>
				{/if}
			</div>
		</div>
		<div class="subtitle-cards">
			<span class="subtitle unselectable">Citations:</span>
			<div class="cards">
				<div class="card text-unselectable" style="background-color: {citations.color};">
					<span>{citations.text}</span>
					<div class="info-ext">
						<InfoBubble text={citations.description} {width} {height}/>
					</div>
				</div>
				{#if critics}
					<div class="card text-unselectable" style="background-color: {COLORS[Color.Red].default};">
						<span>😠 Mostly critics</span>
						<div class="info-ext">
							<InfoBubble text="Most of the citations are critical of this paper" {width} {height}/>
						</div>
					</div>
				{/if}
			</div>
		</div>
		{#if sample_size !== null}
			<div class="subtitle-cards">
				<span class="subtitle unselectable">Sample size:</span>
				<div class="cards">
					<div class="card text-unselectable" style="background-color: {sample_size.color};">
						<span>{sample_size.text}</span>
						<div class="info-ext">
							<InfoBubble text={sample_size.description} {width} {height}/>
						</div>
					</div>
				</div>
			</div>
		{/if}
		{#if p_value !== null}
			<div class="subtitle-cards">
				<span class="subtitle unselectable">P-value:</span>
				<div class="cards">
					<div class="card text-unselectable" style="background-color: {p_value.color};">
						<span>{p_value.text}</span>
						<div class="info-ext">
							<InfoBubble text={p_value.description} {width} {height}/>
						</div>
					</div>
				</div>
			</div>
		{/if}
		<div class="subtitle-cards">
			<span class="subtitle unselectable">Conflict of Interest:</span>
			<div class="cards">
				<div class="card text-unselectable" style="background-color: {conflict_of_interest.color};">
					<span>{conflict_of_interest.text}</span>
					<div class="info-ext">
						<InfoBubble text={conflict_of_interest.description} {width} {height}/>
					</div>
				</div>
			</div>
		</div>
		{#if notes.length > 0}
			<div class="subtitle-cards">
				<span class="subtitle unselectable">Notes:</span>
				<div class="cards">
					{#each notes as note}
						<div class="card text-unselectable" style="background-color: {note.color};">
							<span>{note.text}</span>
							<div class="info-ext">
								<InfoBubble text={note.description} {width} {height}/>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
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
		max-width: calc(var(--details-width) - calc(var(--details-x-pad) * 2));
		position: relative;
		padding: 0.3em 0.75em 0.3em 0.65em;
		border-radius: calc(infinity * 1px);
		cursor: pointer;
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
		text-shadow: 0 0.025em 0.3em rgba(0, 0, 0, 0.25);
	}

	.card .info-ext
	{
		display: none;
		left: 0;
		width: 100%;
	}

	.card:hover .info-ext
	{
		display: block;
	}

	.text
	{
		font-size: 1.03em;
		font-weight: 525;
		color: #585863;
		margin-bottom: 0.1em;
	}
</style>
