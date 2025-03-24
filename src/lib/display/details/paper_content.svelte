<script lang="ts">
	import { COLORS, Color } from '$lib/colors';
	import type { Journal } from '$lib/types/journal';
	import type { Map } from '$lib/types/map';
	import { JournalStatus, type Paper } from '$lib/types/paper';
	import * as cards from '../cards';
	import { float_to_text, int_to_text } from '../utils';

	const { map, journals, paper }: { map: Map, journals: { [id: string]: Journal; }, paper: Paper } = $props();

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
		if (paper.results.consensus === undefined)
			return {
				text: '🤷 No consensus yet',
				color: COLORS[Color.Gray].default
			};

		const answer = map.answers[paper.results.consensus];

		return {
			text: answer.emoji + ' ' + answer.text,
			color: COLORS[answer.color].default
		};
	});

	const result = $derived.by(() =>
	{
		const answer = map.answers[paper.results.conclusion];

		return {
			text: answer.emoji + ' ' + answer.text,
			color: COLORS[answer.color].default
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
		let result: { text: string, color: string | null }[] = [];

		if (paper.review !== undefined)
		{
			result.push({
				text: cards.TO_TEXT[paper.review.type],
				color: cards.REVIEW_COLORS[paper.review.type]
			});

			result.push({ text: 'of', color: null });

			const nb_emoji = cards.review_count_score_to_emoji(paper.score.review_count);

			result.push({
				text: nb_emoji + ' ' + int_to_text(paper.review.count) + ' Papers',
				color: cards.score_to_color(paper.score.review_count)
			});

			if (paper.type !== undefined)
			{
				result.push({ text: 'that are mostly', color: null });

				result.push({
					text: cards.TO_TEXT_PLURAL[paper.type],
					color: cards.score_to_color(paper.score.type)
				});
			}
		}

		else if (paper.type !== undefined)
		{
			result.push({
				text: cards.TO_TEXT[paper.type],
				color: cards.score_to_color(paper.score.type)
			});
		}

		if (paper.on !== undefined)
		{
			result.push({
				text: cards.TO_TEXT[paper.on],
				color: cards.score_to_color(paper.score.on)
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
		color: cards.score_to_color(paper.score.citations_count)
	});

	const critics = $derived.by(() =>
	{
		if (paper.citations.critics)
			return {
				text: '😠 Mostly critics',
				color: COLORS[Color.Red].default
			};

		return null;
	});

	const sample_size = $derived.by(() =>
	{
		if (paper.sample_size === undefined)
			return null;

		return {
			text: cards.sample_size_score_to_emoji(paper.score.sample_size) + ' ' + int_to_text(paper.sample_size),
			color: cards.score_to_color(paper.score.sample_size)
		};
	});

	const p_value = $derived.by(() =>
	{
		if (paper.p_value === undefined)
			return null;

		return {
			text: cards.p_value_score_to_emoji(paper.score.p_value) + (paper.p_value.less_than ? ' < ' : ' ') + float_to_text(paper.p_value.value),
			color: cards.score_to_color(paper.score.p_value)
		};
	});

	const conflict_of_interest = $derived.by(() =>
	{
		if (paper.conflict_of_interest)
			return {
				text: '🤑 Yes',
				color: COLORS[Color.Red].default
			};

		return {
			text: '😇 No',
			color: COLORS[Color.Green].default
		};
	});

	const notes = $derived.by(() =>
	{
		let results = [];

		for (const note of paper.notes)
		{
			if (note.positive)
				results.push({ text: '👍 ' + note.title, color: COLORS[Color.Green].default });
			else
				results.push({ text: '👎 ' + note.title, color: COLORS[Color.Red].default });
		}

		return results;
	});
</script>

<div class="w-full flex flex-col justify-start items-start flex-nowrap" bind:clientWidth={global_width}>
	<a href={link} target="_blank">
		<p class="title">{title}</p>
		<div class="authors-date flex">
			<span>{authors}</span>
			<span class="opacity-50">•</span>
			<span>{year}</span>
		</div>
	</a>
	<div class="part-1" style="gap: 0.75em {part_1_gap}em; flex-wrap: {part_1_flex_wrap};" bind:this={part_1}>
		<div class="subtitle-cards" bind:clientWidth={consensus_width}>
			<span class="subtitle">Previous consensus:</span>
			<div class="cards">
				<div class="card" style="background-color: {consensus.color};">
					<span>{consensus.text}</span>
				</div>
			</div>
		</div>
		<div class="subtitle-cards">
			<span class="subtitle">Result:</span>
			<div class="cards">
				<div class="card" style="background-color: {result.color};" bind:clientWidth={result_width}>
					<span>{result.text}</span>
				</div>
				{#if indirect}
					<div class="card" style="background-color: {COLORS[Color.Red].default};" bind:clientWidth={indirect_width}>
						<span>🔗 Indirect</span>
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
						{#if part.color === null}
							<div class="text">
								<span>{part.text}</span>
							</div>
						{:else}
							<div class="card" style="background-color: {part.color};">
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
				<div class="card" style="background-color: {journal.color};">
					<span>{journal.text}</span>
				</div>
				{#if retracted}
					<span class="card" style="background-color: {COLORS[Color.Red].default};">😵 Retracted</span>
				{/if}
			</div>
		</div>
		<div class="subtitle-cards">
			<span class="subtitle unselectable">Citations:</span>
			<div class="cards">
				<div class="card" style="background-color: {citations.color};">
					<span>{citations.text}</span>
				</div>
				{#if critics !== null}
					<div class="card" style="background-color: {critics.color};">
						<span>{critics.text}</span>
					</div>
				{/if}
			</div>
		</div>
		{#if sample_size !== null}
			<div class="subtitle-cards">
				<span class="subtitle unselectable">Sample size:</span>
				<div class="cards">
					<div class="card" style="background-color: {sample_size.color};">
						<span>{sample_size.text}</span>
					</div>
				</div>
			</div>
		{/if}
		{#if p_value !== null}
			<div class="subtitle-cards">
				<span class="subtitle unselectable">P-value:</span>
				<div class="cards">
					<div class="card" style="background-color: {p_value.color};">
						<span>{p_value.text}</span>
					</div>
				</div>
			</div>
		{/if}
		<div class="subtitle-cards">
			<span class="subtitle unselectable">Conflict of Interest:</span>
			<div class="cards">
				<div class="card" style="background-color: {conflict_of_interest.color};">
					<span>{conflict_of_interest.text}</span>
				</div>
			</div>
		</div>
		{#if notes.length > 0}
			<div class="subtitle-cards">
				<span class="subtitle unselectable">Notes:</span>
				<div class="cards">
					{#each notes as note}
						<div class="card" style="background-color: {note.color};">
							<span>{note.text}</span>
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
		@apply flex flex-row justify-start items-start;
		margin-top: 0.6em;
		margin-bottom: 1em;
	}

	.subtitle-cards
	{
		@apply flex flex-col justify-start items-start flex-nowrap;
		gap: 0.3em;
	}

	.subtitle
	{
		font-size: 1.05em;
		font-weight: 600;
	}

	.cards
	{
		@apply flex flex-row justify-start items-center flex-wrap;
		gap: 0.5em;
	}

	.card
	{
		position: relative;
		font-weight: 450;
		color: white;
		letter-spacing: 0.01em;
		padding: 0.25em 0.75em 0.35em 0.65em;
		border-radius: calc(infinity * 1px);
		text-shadow: 0 0.025em 0.3em rgba(0, 0, 0, 0.25);
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
		@apply flex flex-row justify-start items-start flex-wrap;
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
