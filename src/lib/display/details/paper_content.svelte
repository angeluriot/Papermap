<script lang="ts">
	import { COLORS, Color } from '$lib/colors';
	import type { Journal } from '$lib/types/journal';
	import type { Map } from '$lib/types/map';
	import { Edit, JournalStatus, type Paper, StudyOn } from '$lib/types/paper';
	import * as cards from './cards';
	import { float_to_text, int_to_text } from '../utils';
	import InfoBubble from './info_bubble.svelte';
	import Link from '$lib/svgs/link.svg';

	let { emojis, map, journals, paper, width, height, journal_info_open = $bindable(), edit_mode }: {
		emojis: Record<string, string>,
		map: Map,
		journals: { [id: string]: Journal; },
		paper: Paper,
		width: number,
		height: number,
		journal_info_open: boolean,
		edit_mode: boolean,
	} = $props();

	function send_event(event_name: string)
	{
		const event = new CustomEvent(event_name, { detail: paper.uuid });
		document.dispatchEvent(event);
	}

	function delete_paper()
	{
		send_event('delete_paper');
	}

	function recreate_paper()
	{
		send_event('recreate_paper');
	}

	function edit_paper()
	{
		send_event('edit_paper');
	}

	function cancel_changes()
	{
		send_event('cancel_changes');
	}

	const title = $derived(paper.title);
	const link = $derived(paper.link);

	function color_to_shadow(color: string | undefined): string
	{
		return cards.color_to_shadow(color) + '50';
	}

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
			emoji: answer.emoji,
			text: answer.text,
			color: COLORS[answer.color].default,
			shadow: color_to_shadow(COLORS[answer.color].default),
			description: answer.description,
		};
	});

	const result = $derived.by(() =>
	{
		const answer = map.conclusions[paper.results.conclusion];

		return {
			emoji: answer.emoji,
			text: answer.text,
			color: COLORS[answer.color].default,
			shadow: color_to_shadow(COLORS[answer.color].default),
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
		let result: ({ text: string, is_card: false } | { emoji: string, text: string, color: string, shadow: string, description: string, is_card: true })[] = [];

		if (paper.review)
		{
			result.push({
				emoji: cards.TO_EMOJI[paper.review.type],
				text: cards.TO_TEXT[paper.review.type],
				color: cards.REVIEW_COLORS[paper.review.type],
				shadow: color_to_shadow(cards.REVIEW_COLORS[paper.review.type]),
				description: cards.TO_DESCRIPTION[paper.review.type],
				is_card: true,
			});

			result.push({ text: 'of', is_card: false });

			const nb_emoji = cards.review_count_score_to_emoji(paper.score.review_count);

			result.push({
				emoji: nb_emoji,
				text: int_to_text(paper.review.count) + ' Papers',
				color: cards.score_to_color(paper.score.review_count),
				shadow: color_to_shadow(cards.score_to_color(paper.score.review_count)),
				description: int_to_text(paper.review.count) + ' papers were included in this ' + cards.TO_TEXT[paper.review.type].slice(2).toLowerCase(),
				is_card: true,
			});

			if (paper.type)
			{
				result.push({ text: 'that are mostly', is_card: false });

				result.push({
					emoji: cards.TO_EMOJI[paper.type],
					text: cards.TO_TEXT_PLURAL[paper.type],
					color: cards.score_to_color(paper.score.type),
					shadow: color_to_shadow(cards.score_to_color(paper.score.type)),
					description: cards.TO_DESCRIPTION[paper.type],
					is_card: true,
				});
			}
		}

		else if (paper.type)
		{
			result.push({
				emoji: cards.TO_EMOJI[paper.type],
				text: cards.TO_TEXT[paper.type],
				color: cards.score_to_color(paper.score.type),
				shadow: color_to_shadow(cards.score_to_color(paper.score.type)),
				description: cards.TO_DESCRIPTION[paper.type],
				is_card: true,
			});
		}

		if (paper.type && paper.on)
		{
			if (paper.on !== StudyOn.InVitro)
				result.push({ text: 'on', is_card: false });

			result.push({
				emoji: cards.TO_EMOJI[paper.on],
				text: cards.TO_TEXT[paper.on],
				color: cards.score_to_color(paper.score.on),
				shadow: color_to_shadow(cards.score_to_color(paper.score.on)),
				description: cards.TO_DESCRIPTION[paper.on],
				is_card: true,
			});
		}

		return result;
	});

	const journal = $derived.by(() =>
	{
		if (paper.journal.status === JournalStatus.NotFound)
			return {
				emoji: '🤷',
				text: 'Journal not found',
				color: COLORS[Color.Gray].default,
				shadow: color_to_shadow(COLORS[Color.Gray].default),
				description: 'This paper was published in a journal that is not in the Papermap database',
			};

		if (paper.journal.status === JournalStatus.NotPublished)
			return {
				emoji: '📭',
				text: 'Not published yet',
				color: COLORS[Color.Gray].default,
				shadow: color_to_shadow(COLORS[Color.Gray].default),
				description: 'This paper has not been published in a journal yet',
			};

		return {
			emoji: cards.score_to_emoji(paper.score.journal),
			text: journals[paper.journal.id as string].title,
			color: cards.score_to_color(paper.score.journal),
			shadow: color_to_shadow(cards.score_to_color(paper.score.journal)),
			journal: journals[paper.journal.id as string],
		};
	});

	const retracted = $derived(paper.journal.retracted);

	const sample_size = $derived.by(() =>
	{
		if (paper.sample_size === undefined)
			return null;

		return {
			emoji: cards.sample_size_score_to_emoji(paper.score.sample_size),
			text: int_to_text(paper.sample_size),
			color: cards.score_to_color(paper.score.sample_size),
			shadow: color_to_shadow(cards.score_to_color(paper.score.sample_size)),
			description: int_to_text(paper.sample_size) + ' individuals were included in this study',
		};
	});

	const p_value = $derived.by(() =>
	{
		if (paper.p_value === undefined)
			return null;

		return {
			emoji: cards.p_value_score_to_emoji(paper.score.p_value),
			text: (paper.p_value.less_than ? ' < ' : ' ') + float_to_text(paper.p_value.value),
			color: cards.score_to_color(paper.score.p_value),
			shadow: color_to_shadow(cards.score_to_color(paper.score.p_value)),
			description: `There is ${paper.p_value.less_than ? 'less than' : ''} a ${float_to_text(paper.p_value.value * 100)}% probability that these results occurred by chance`,
		};
	});

	const citations = $derived({
		emoji: cards.citation_score_to_emoji(paper.score.citations_count),
		text: int_to_text(paper.citations.count),
		color: cards.score_to_color(paper.score.citations_count),
		shadow: color_to_shadow(cards.score_to_color(paper.score.citations_count)),
		description: 'This paper has been cited ' + int_to_text(paper.citations.count) + ' times in other papers',
	});

	const critics = $derived(paper.citations.critics);

	const conflict_of_interest = $derived.by(() =>
	{
		if (paper.conflict_of_interest)
			return {
				emoji: '🤑',
				text: 'Yes',
				color: COLORS[Color.Red].default,
				shadow: color_to_shadow(COLORS[Color.Red].default),
				description: "The authors or funders have conflicting interests that may have influenced the conclusion",
			};

		return {
			emoji: '😇',
			text: 'No',
			color: COLORS[Color.Green].default,
			shadow: color_to_shadow(COLORS[Color.Green].default),
			description: "The authors declared no conflict of interest",
		};
	});

	const notes = $derived.by(() =>
	{
		let results = [];

		for (const note of paper.notes)
		{
			results.push({
				emoji: cards.impact_to_emoji(note.impact),
				text: note.title,
				color: cards.impact_to_color(note.impact),
				shadow: color_to_shadow(cards.impact_to_color(note.impact)),
				description: note.description,
			});
		}

		return results;
	});
</script>

<svelte:window onclick={() => journal_info_open = false} />

{#snippet emoji(emoji: string)}
	<div class="emoji">{@html emojis[emoji]}</div>
{/snippet}

<div class="w-full flex flex-col justify-start items-start flex-nowrap" bind:clientWidth={global_width}>
	{#if edit_mode}
		<div class="edit w-full flex flex-row justify-end items-center">
			{#if paper.edit === Edit.Deleted}
				<button
					class="recreate-button relative card text-unselectable cursor-pointer overflow-hidden"
					style="--shadow-color: #00008050" onclick={recreate_paper}
				>
					{@render emoji('↩️')}
					<span>Cancel deletion</span>
					<div class="absolute edit-mask bg-[#00008010]"></div>
				</button>
			{:else}
				{#if paper.edit === Edit.Edited}
					<button
						class="recreate-button relative card text-unselectable cursor-pointer overflow-hidden"
						style="--shadow-color: #00008050" onclick={cancel_changes}
					>
						{@render emoji('↩️')}
						<span>Cancel changes</span>
						<div class="absolute edit-mask bg-[#00008010]"></div>
					</button>
				{/if}
				<button
					class="edit-button relative card text-unselectable cursor-pointer overflow-hidden"
					style="--shadow-color: #80000050" onclick={edit_paper}
				>
					{@render emoji('🙂')}
					<span>Edit</span>
					<div class="absolute edit-mask bg-[#80000015]"></div>
				</button>
				<button
					class="delete-button relative card text-unselectable cursor-pointer overflow-hidden"
					style="--shadow-color: #80000050" onclick={delete_paper}
				>
					{@render emoji('😨')}
					<span>Delete</span>
					<div class="absolute edit-mask bg-[#80000025]"></div>
				</button>
			{/if}
		</div>
		<div class="line w-full"></div>
	{/if}
	<a href={link} target="_blank" class="title-container w-full" title={paper.title}>
		<p class="title">{title}</p>
		<div class="authors-date flex">
			<p class="authors">{authors}</p>
			<span class="opacity-50 unselectable">•</span>
			<span>{year}</span>
		</div>
	</a>
	<div class="part-1" style="gap: 0.75em {part_1_gap}em; flex-wrap: {part_1_flex_wrap};" bind:this={part_1}>
		<div class="subtitle-cards" bind:clientWidth={consensus_width}>
			<span class="subtitle unselectable">Previous consensus:</span>
			<div class="cards">
				<div class="card text-unselectable" style="background-color: {consensus.color}; --shadow-color: {consensus.shadow};">
					{@render emoji(consensus.emoji)}
					<span>{consensus.text}</span>
					<div class="info-ext absolute">
						<InfoBubble {emojis} text={consensus.description} {width} {height}/>
					</div>
				</div>
			</div>
		</div>
		<div class="subtitle-cards">
			<span class="subtitle unselectable">Result:</span>
			<div class="cards">
				<div class="card text-unselectable" style="background-color: {result.color}; --shadow-color: {result.shadow};" bind:clientWidth={result_width}>
					{@render emoji(result.emoji)}
					<span>{result.text}</span>
					<div class="info-ext">
						<InfoBubble {emojis} text={result.description} {width} {height}/>
					</div>
				</div>
				{#if indirect}
					<div
						class="card text-unselectable" bind:clientWidth={indirect_width}
						style="background-color: {COLORS[Color.Red].default}; --shadow-color: {color_to_shadow(COLORS[Color.Red].default)};"
					>
						{@render emoji('🔗')}
						<span>Indirect</span>
						<div class="info-ext">
							<InfoBubble {emojis} text="This conclusion is based on indirect evidence from the paper" {width} {height}/>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
	<div class="quote flex flex-row justify-start items-start flex-nowrap w-full">
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
						{#if part.is_card}
							<div class="card text-unselectable" style="background-color: {part.color}; --shadow-color: {part.shadow};">
								{#if part.emoji}
									{@render emoji(part.emoji)}
								{/if}
								<span>{part.text}</span>
								{#if part.description}
									<div class="info-ext">
										<InfoBubble {emojis} text={part.description} {width} {height}/>
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
				<div
					class="card text-unselectable"
					style="background-color: {journal.color}; --shadow-color: {journal.shadow};"
					onclick={event => { if (journal.journal !== undefined) journal_info_open = true; event.stopPropagation(); }}
					onkeydown={null}
					role="button" tabindex={0}
				>
					{@render emoji(journal.emoji)}
					<span>{journal.text}</span>
					<div
						class="info-ext" style="{journal_info_open ? 'display: block;' : ''}"
						onclick={event => event.stopPropagation()} onkeydown={null}
						role="button" tabindex={2}
					>
						{#if journal.journal !== undefined}
							<InfoBubble {emojis} journal={journal.journal} {width} {height}/>
						{:else}
							<InfoBubble {emojis} text={journal.description} {width} {height}/>
						{/if}
					</div>
				</div>
				{#if retracted}
					<div
						class="card text-unselectable"
						style="background-color: {COLORS[Color.Red].default}; --shadow-color: {color_to_shadow(COLORS[Color.Red].default)};"
					>
						{@render emoji('😵')}
						<span>Retracted</span>
						<div class="info-ext">
							<InfoBubble {emojis} text="This paper has been retracted by the journal" {width} {height}/>
						</div>
					</div>
				{/if}
			</div>
		</div>
		{#if sample_size !== null}
			<div class="subtitle-cards">
				<span class="subtitle unselectable">Sample size:</span>
				<div class="cards">
					<div class="card text-unselectable" style="background-color: {sample_size.color}; --shadow-color: {sample_size.shadow};">
						{@render emoji(sample_size.emoji)}
						<span>{sample_size.text}</span>
						<div class="info-ext">
							<InfoBubble {emojis} text={sample_size.description} {width} {height}/>
						</div>
					</div>
				</div>
			</div>
		{/if}
		{#if p_value !== null}
			<div class="subtitle-cards">
				<span class="subtitle unselectable">P-value:</span>
				<div class="cards">
					<div class="card text-unselectable" style="background-color: {p_value.color}; --shadow-color: {p_value.shadow};">
						{@render emoji(p_value.emoji)}
						<span>{p_value.text}</span>
						<div class="info-ext">
							<InfoBubble {emojis} text={p_value.description} {width} {height}/>
						</div>
					</div>
				</div>
			</div>
		{/if}
		<div class="subtitle-cards">
			<span class="subtitle unselectable">Citations:</span>
			<div class="cards">
				<div class="card text-unselectable" style="background-color: {citations.color}; --shadow-color: {citations.shadow};">
					{@render emoji(citations.emoji)}
					<span>{citations.text}</span>
					<div class="info-ext">
						<InfoBubble {emojis} text={citations.description} {width} {height}/>
					</div>
				</div>
				{#if critics}
					<div
						class="card text-unselectable"
						style="background-color: {COLORS[Color.Red].default}; --shadow-color: {color_to_shadow(COLORS[Color.Red].default)};"
					>
						{@render emoji('😠')}
						<span>Mostly critics</span>
						<div class="info-ext">
							<InfoBubble {emojis} text="Most of the citations are critical of this paper" {width} {height}/>
						</div>
					</div>
				{/if}
			</div>
		</div>
		<div class="subtitle-cards">
			<span class="subtitle unselectable">Conflict of Interest:</span>
			<div class="cards">
				<div class="card text-unselectable" style="background-color: {conflict_of_interest.color}; --shadow-color: {conflict_of_interest.shadow};">
					{@render emoji(conflict_of_interest.emoji)}
					<span>{conflict_of_interest.text}</span>
					<div class="info-ext">
						<InfoBubble {emojis} text={conflict_of_interest.description} {width} {height}/>
					</div>
				</div>
			</div>
		</div>
		{#if notes.length > 0}
			<div class="subtitle-cards">
				<span class="subtitle unselectable">Notes:</span>
				<div class="cards">
					{#each notes as note}
						<div class="card text-unselectable" style="background-color: {note.color}; --shadow-color: {note.shadow};">
							{@render emoji(note.emoji)}
							<span>{note.text}</span>
							<div class="info-ext">
								<InfoBubble {emojis} text={note.description} {width} {height}/>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
	<div class="footer w-full flex flex-row justify-end items-center flex-nowrap">
		<a href="https://github.com/angeluriot/Papermap/blob/main/doc/scoring.md" target="_blank" class="flex-center-row flex-nowrap">
			<img src={Link} alt="link" class="img-unselectable"/>
			<span class="unselectable">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;How papers are scored?</span>
		</a>
	</div>
</div>

<style>
	p, span
	{
		font-family: Satoshi-Variable, sans-serif;
		line-height: 1.25em;
	}

	span
	{
		text-wrap: nowrap;
	}

	.edit
	{
		gap: 0.7em;
		margin-bottom: -0.2em;
	}

	.edit-button
	{
		background-color: #f29436;
	}

	.delete-button
	{
		background-color: #ea3f60;
	}

	.recreate-button
	{
		background-color: #24c68c;
	}

	.edit-mask
	{
		display: none;
		left: 0em;
		top: 0em;
		width: 100%;
		height: 100%;
	}

	.edit button:hover .edit-mask
	{
		display: block;
	}

	.title-container:hover .title
	{
		text-decoration: underline;
	}

	.title
	{
		font-family: Satoshi-Variable, sans-serif;
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

	.authors
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

	.card .emoji
	{
		width: 1.1em;
		height: 1.1em;
		filter: drop-shadow(0 0.025em 0.3em var(--shadow-color));
		transform: translateZ(0);
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

	.text
	{
		font-size: 1.03em;
		font-weight: 525;
		color: #585863;
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

	.footer
	{
		font-size: 0.95em;
		margin-top: 0.9em;
		font-weight: 500;
		text-align: right;
		color: #9193a2;
	}

	.footer a img
	{
		width: 0.9em;
		height: 0.9em;
		margin-top: -0.1em;
		margin-right: -1em;
	}

	.footer a:hover
	{
		text-decoration: underline;
	}
</style>
