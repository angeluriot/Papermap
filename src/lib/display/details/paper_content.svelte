<script lang="ts">
	import { COLORS, Color } from '$lib/colors';
	import type { Journal } from '$lib/types/journal';
	import type { Map } from '$lib/types/map';
	import { JournalStatus, type Paper, StudyOn } from '$lib/types/paper';
	import * as cards from './cards';
	import { float_to_text, int_to_text } from '../utils';
	import InfoBubble from './info_bubble.svelte';

	const { map, journals, paper, width, height }: {
		map: Map,
		journals: { [id: string]: Journal; },
		paper: Paper,
		width: number,
		height: number
	} = $props();

	const title = $derived(paper.title);
	const link = $derived(paper.link);

	function get_name(author: string): string
	{
		const names = author.split(' ');
		let result = '';

		for (let i = 0; i < names.length - 1; i++)
			result += names[i][0].toUpperCase();

		return names[names.length - 1] + ' ' + result;
	}

	const authors = $derived.by(() =>
	{
		if (paper.authors.length === 1)
			return get_name(paper.authors[0]);

		if (paper.authors.length === 2)
			return get_name(paper.authors[0]) + ' & ' + get_name(paper.authors[1]);

		if (paper.authors.length === 3)
			return get_name(paper.authors[0]) + ', ' + get_name(paper.authors[1]) + ' & ' + get_name(paper.authors[2]);

		return get_name(paper.authors[0]) + ', ' + get_name(paper.authors[1]) + ', ' + get_name(paper.authors[2]) + ', et al.';
	});

	const year = $derived(paper.year);

	const consensus = $derived.by(() =>
	{
		const answer = map.consensus[paper.results.consensus];

		return {
			text: answer.emoji + ' ' + answer.text,
			color: COLORS[answer.color].default,
			description: answer.description,
		};
	});

	const result = $derived.by(() =>
	{
		const answer = map.conclusions[paper.results.conclusion];

		return {
			text: answer.emoji + ' ' + answer.text,
			color: COLORS[answer.color].default,
			description: answer.description,
		};
	});

	const indirect = $derived(paper.results.indirect);

	const part_1_gap = 2;
	let global_width: number | undefined = $state(undefined);
	let consensus_width: number | undefined = $state(undefined);
	let result_width: number | undefined = $state(undefined);
	let indirect_width: number | undefined = $state(undefined);
	let part_1: HTMLDivElement | undefined = $state(undefined);
	let part_1_flex_wrap: string = $derived.by(() =>
	{
		if (global_width === undefined || consensus_width === undefined || result_width === undefined || part_1 === undefined)
			return 'nowrap';

		const result_part_width = Math.max(result_width, (indirect_width ? indirect_width : 0));
		const em = parseFloat(getComputedStyle(part_1).fontSize);
		const part_1_width = consensus_width + result_part_width + part_1_gap * em;

		return part_1_width > global_width ? 'wrap' : 'nowrap';
	});

	const quote_parts = $derived.by(() =>
	{
		const parts = paper.quote.split('[...]');
		let result = [{ text: parts[0].trim(), italic: true }];

		for (let i = 1; i < parts.length; i++)
		{
			result.push({ text: ' [...] ', italic: false });
			result.push({ text: parts[i].trim(), italic: true });
		}

		return result;
	});

	const paper_type_parts = $derived.by(() =>
	{
		let result: { text: string, color?: string, description?: string }[] = [];

		if (paper.review)
		{
			result.push({
				text: cards.TO_TEXT[paper.review.type],
				color: cards.REVIEW_COLORS[paper.review.type],
				description: cards.TO_DESCRIPTION[paper.review.type],
			});

			result.push({ text: 'of' });

			const nb_emoji = cards.review_count_score_to_emoji(paper.score.review_count);

			result.push({
				text: nb_emoji + ' ' + int_to_text(paper.review.count) + ' Papers',
				color: cards.score_to_color(paper.score.review_count),
				description: int_to_text(paper.review.count) + ' papers were included in this ' + cards.TO_TEXT[paper.review.type].slice(2).toLowerCase(),
			});

			if (paper.type)
			{
				result.push({ text: 'that are mostly' });

				result.push({
					text: cards.TO_TEXT_PLURAL[paper.type],
					color: cards.score_to_color(paper.score.type),
					description: cards.TO_DESCRIPTION[paper.type],
				});
			}
		}

		else if (paper.type)
		{
			result.push({
				text: cards.TO_TEXT[paper.type],
				color: cards.score_to_color(paper.score.type),
				description: cards.TO_DESCRIPTION[paper.type],
			});
		}

		if (paper.type && paper.on)
		{
			if (paper.on !== StudyOn.InVitro)
				result.push({ text: 'on' });

			result.push({
				text: cards.TO_TEXT[paper.on],
				color: cards.score_to_color(paper.score.on),
				description: cards.TO_DESCRIPTION[paper.on],
			});
		}

		return result;
	});

	const journal = $derived.by(() =>
	{
		if (paper.journal.status === JournalStatus.NotFound)
			return { text: '🤷 Journal not found', color: COLORS[Color.Gray].default };

		if (paper.journal.status === JournalStatus.NotPublished)
			return { text: '📭 Not published yet', color: COLORS[Color.Gray].default };

		return {
			text: cards.score_to_emoji(paper.score.journal) + ' ' + journals[paper.journal.id as string].titles[0],
			color: cards.score_to_color(paper.score.journal)
		};
	});

	const retracted = $derived(paper.journal.retracted);

	const citations = $derived({
		text: cards.citation_score_to_emoji(paper.score.citations_count) + ' ' + int_to_text(paper.citations.count),
		color: cards.score_to_color(paper.score.citations_count),
		description: 'This paper has been cited ' + int_to_text(paper.citations.count) + ' times in other papers',
	});

	const critics = $derived(paper.citations.critics);

	const sample_size = $derived.by(() =>
	{
		if (paper.sample_size === undefined)
			return null;

		return {
			text: cards.sample_size_score_to_emoji(paper.score.sample_size) + ' ' + int_to_text(paper.sample_size),
			color: cards.score_to_color(paper.score.sample_size),
			description: int_to_text(paper.sample_size) + ' individuals were included in this study',
		};
	});

	const p_value = $derived.by(() =>
	{
		if (paper.p_value === undefined)
			return null;

		return {
			text: cards.p_value_score_to_emoji(paper.score.p_value) + (paper.p_value.less_than ? ' < ' : ' ') + float_to_text(paper.p_value.value),
			color: cards.score_to_color(paper.score.p_value),
			description: `There is ${paper.p_value.less_than ? 'less than' : ''} a ${float_to_text(paper.p_value.value * 100)}% probability that these results occurred by chance`,
		};
	});

	const conflict_of_interest = $derived.by(() =>
	{
		if (paper.conflict_of_interest)
			return {
				text: '🤑 Yes',
				color: COLORS[Color.Red].default,
				description: "The authors or funders have conflicting interests that may have influenced the conclusion",
			};

		return {
			text: '😇 No',
			color: COLORS[Color.Green].default,
			description: "The authors declared no conflict of interest",
		};
	});

	const notes = $derived.by(() =>
	{
		let results = [];

		for (const note of paper.notes)
		{
			if (note.positive)
				results.push({
					text: '👍 ' + note.title,
					color: COLORS[Color.Green].default,
					description: note.description,
				});
			else
				results.push({
					text: '👎 ' + note.title,
					color: COLORS[Color.Red].default,
					description: note.description,
				});
		}

		return results;
	});
</script>

<div class="w-full flex flex-col justify-start items-start flex-nowrap" bind:clientWidth={global_width}>
	<a href={link} target="_blank">
		<p class="title">{title}</p>
		<div class="authors-date flex">
			<span>{authors}</span>
			<span class="opacity-50 unselectable">•</span>
			<span>{year}</span>
		</div>
	</a>
	<div class="part-1" style="gap: 0.75em {part_1_gap}em; flex-wrap: {part_1_flex_wrap};" bind:this={part_1}>
		<div class="subtitle-cards" bind:clientWidth={consensus_width}>
			<span class="subtitle unselectable">Previous consensus:</span>
			<div class="cards">
				<div class="card text-unselectable" style="background-color: {consensus.color};">
					<span>{consensus.text}</span>
					<div class="info-ext absolute">
						<InfoBubble text={consensus.description} {width} {height}/>
					</div>
				</div>
			</div>
		</div>
		<div class="subtitle-cards">
			<span class="subtitle unselectable">Result:</span>
			<div class="cards">
				<div class="card text-unselectable" style="background-color: {result.color};" bind:clientWidth={result_width}>
					<span>{result.text}</span>
					<div class="info-ext">
						<InfoBubble text={result.description} {width} {height}/>
					</div>
				</div>
				{#if indirect}
					<div class="card text-unselectable" style="background-color: {COLORS[Color.Red].default};" bind:clientWidth={indirect_width}>
						<span>🔗 Indirect</span>
						<div class="info-ext">
							<InfoBubble text="The conclusion of this paper is based on indirect evidence" {width} {height}/>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
	<div class="quote flex flex-row justify-start items-start flex-nowrap">
		<p>
			{#each quote_parts as part, i}
				{#if part.italic}
					<i>{i === 0 ? '“' : ''}{part.text}{i === quote_parts.length - 1 ? '”' : ''}</i>
				{:else}
					{part.text}
				{/if}
			{/each}
		</p>
	</div>
	<div class="line w-full"></div>
	<div class="part-2">
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

	.authors-date
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
		margin-top: 0.6em;
		margin-bottom: 1em;
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

	.quote
	{
		font-weight: 525;
		color: #606270;
	}

	.quote
	{
		padding: 0.7em 0.8em;
		background-color: #e6ebf7;
		border-left: 0.5em solid #c2c9e2;
	}

	.part-2
	{
		display: flex;
		flex-direction: row;
		justify-content: start;
		align-items: start;
		flex-wrap: wrap;
		gap: 1em 2em;
	}

	.line
	{
		height: 2px;
		background-color: #d4d9e7;
		border-radius: calc(infinity * 1px);
		margin-top: 1.1em;
		margin-bottom: 0.8em;
	}
</style>
