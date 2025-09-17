<script lang="ts">
	import { COLORS, Color } from '$lib/colors';
	import type { Journal } from '$lib/types/journal';
	import type { Map } from '$lib/types/map';
	import { Edit, JournalMissingReason, MissingReason, type Paper, ReviewType, PaperType, ReviewedPapersType, ReviewedPapersBlinding, Blinding } from '$lib/types/paper';
	import * as cards from './cards';
	import { float_to_text, get_standard_name, int_to_text } from '../utils';
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

	const authors = $derived.by(() =>
	{
		if (paper.institution)
			return paper.institution.name;

		if (paper.authors.length === 1)
			return get_standard_name(paper.authors[0]);

		if (paper.authors.length === 2)
			return get_standard_name(paper.authors[0]) + ' & ' + get_standard_name(paper.authors[1]);

		if (paper.authors.length === 3)
			return get_standard_name(paper.authors[0]) + ', ' + get_standard_name(paper.authors[1]) + ' & ' + get_standard_name(paper.authors[2]);

		return get_standard_name(paper.authors[0]) + ', ' + get_standard_name(paper.authors[1]) + ', ' + get_standard_name(paper.authors[2]) + ', et al.';
	});

	const year = $derived(paper.year);

	const consensus = $derived.by(() =>
	{
		if (paper.results.consensus === MissingReason.NotSpecified)
			return {
				emoji: '🤷',
				text: 'Not specified',
				color: COLORS[Color.Gray].default,
				shadow: color_to_shadow(COLORS[Color.Gray].default),
				description: 'The paper does not mention any prior literature on the topic',
			};

		if (paper.results.consensus === MissingReason.NoAccess)
			return {
				emoji: '🔒',
				text: 'No access',
				color: COLORS[Color.Gray].default,
				shadow: color_to_shadow(COLORS[Color.Gray].default),
				description: "The previous consensus is not available because we couldn't access the full text of the paper",
			};

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
		const answer_group = map.conclusion_groups[answer.group];

		return {
			emoji: answer.emoji,
			text: answer.text,
			color: COLORS[answer_group.color].default,
			shadow: color_to_shadow(COLORS[answer_group.color].default),
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
		const raw_parts = paper.quote.split(/(\[.*?\])/);

		let parts = raw_parts.filter(part => part.length > 0).map(part => ({
			text: part,
			italic: !part.startsWith('[')
		}));

		if (parts.some(p => p.italic))
		{
			parts[0].text = '“' + parts[0].text;
			parts[parts.length - 1].text = parts[parts.length - 1].text + '”';
		}

		return parts;
	});

	const paper_type_parts = $derived.by(() =>
	{
		let result: ({ text: string, is_card: false } | { emoji: string, text: string, color: string, shadow: string, description: string, is_card: true })[] = [];
		let review_one = paper.review?.count === 1;

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

			result.push({ text: 'of' + (review_one ? ' a' : ''), is_card: false });

			if (paper.review.count === MissingReason.NoAccess)
			{
				result.push({
					emoji: '🔒',
					text: 'No access',
					color: COLORS[Color.Gray].default,
					shadow: color_to_shadow(COLORS[Color.Gray].default),
					description: `The number of papers included in this ${cards.TO_TEXT[paper.review.type].toLowerCase()} is not available because we couldn't access the full text of the paper`,
					is_card: true,
				});

				result.push({ text: 'papers', is_card: false })
			}

			else if (!review_one)
			{
				result.push({
					emoji: cards.review_count_score_to_emoji(paper.scores.review_count),
					text: (paper.review.estimate ? '≈ ' : '') + int_to_text(paper.review.count) + ' Papers' + (paper.review.subpart ? '*' : ''),
					color: cards.score_to_color(paper.scores.review_count),
					shadow: color_to_shadow(cards.score_to_color(paper.scores.review_count)),
					description: (
						(paper.review.estimate ? 'About ' : '') +
						int_to_text(paper.review.count) +
						' papers were included in this ' +
						cards.TO_TEXT[paper.review.type].toLowerCase() +
						(paper.review.subpart ? ' (but only a small portion of them were actually used to answer the question of this page)' : '')
					),
					is_card: true,
				});
			}
		}

		if (!review_one && ((paper.type !== PaperType.Other && paper.type !== ReviewedPapersType.DiverseTypes && result.length > 0) || paper.review?.reviews))
		{
			if (!result[result.length - 1].is_card)
				result[result.length - 1].text += ' that are mostly';
			else
				result.push({ text: 'that are mostly', is_card: false });
		}

		if (paper.review?.reviews)
		{
			result.push({
				emoji: cards.TO_EMOJI[ReviewType.NarrativeReview],
				text: 'Literature review' + (review_one ? '' : 's'),
				color: cards.REVIEW_COLORS[ReviewType.NarrativeReview],
				shadow: color_to_shadow(cards.REVIEW_COLORS[ReviewType.NarrativeReview]),
				description: cards.TO_DESCRIPTION[ReviewType.NarrativeReview],
				is_card: true,
			});

			if (paper.type !== PaperType.Other && paper.type !== ReviewedPapersType.DiverseTypes)
				result.push({ text: 'of', is_card: false });
		}

		if (paper.type === MissingReason.NoAccess)
		{
			result.push({
				emoji: '🔒',
				text: 'No access',
				color: COLORS[Color.Gray].default,
				shadow: color_to_shadow(COLORS[Color.Gray].default),
				description: (
					paper.review ?
					`The type of the papers reviewed by this ${cards.TO_TEXT[paper.review.type].toLowerCase()} is not available because we couldn't access the full text of the paper` :
					"The type of study is not available because we couldn't access the full text of the paper"
				),
				is_card: true,
			});
		}

		else if (paper.type !== PaperType.Other && paper.type !== ReviewedPapersType.DiverseTypes)
		{
			const show_blinding = (
				paper.type === PaperType.RandomizedControlledTrial ||
				paper.type === ReviewedPapersType.DiverseClinicalTrials ||
				paper.type === ReviewedPapersType.DiverseHumanStudies
			);

			if (show_blinding)
			{
				if (paper.blinding === MissingReason.NoAccess)
				{
					result.push({
						emoji: '🔒',
						text: 'No access',
						color: COLORS[Color.Gray].default,
						shadow: color_to_shadow(COLORS[Color.Gray].default),
						description: (
							paper.review ?
							`The blinding strategies employed in the papers reviewed by this ${cards.TO_TEXT[paper.review.type].toLowerCase()} are not available because we couldn't access the full text of the paper` :
							"The blinding strategies employed in this study are not available because we couldn't access the full text of the paper"
						),
						is_card: true,
					});
				}

				else if (paper.blinding !== Blinding.None && paper.blinding !== ReviewedPapersBlinding.DiverseBlinding)
				{
					result.push({
						emoji: cards.TO_EMOJI[paper.blinding],
						text: cards.TO_TEXT[paper.blinding],
						color: cards.score_to_color(paper.scores.blinding),
						shadow: color_to_shadow(cards.score_to_color(paper.scores.blinding)),
						description: cards.TO_DESCRIPTION[paper.blinding],
						is_card: true,
					});
				}
			}

			result.push({
				emoji: cards.TO_EMOJI[paper.type],
				text: paper.review && (!review_one || paper.review.reviews) ? cards.TO_TEXT_PLURAL[paper.type] : cards.TO_TEXT[paper.type],
				color: cards.score_to_color(paper.scores.type),
				shadow: color_to_shadow(cards.score_to_color(paper.scores.type)),
				description: cards.TO_DESCRIPTION[paper.type] + (
					paper.type === PaperType.RandomizedControlledTrial && paper.blinding === Blinding.None ? ' (no blinding)' : ''
				),
				is_card: true,
			});

			if (show_blinding && paper.blinding === ReviewedPapersBlinding.DiverseBlinding)
			{
				result.push({ text: 'with', is_card: false });

				result.push({
					emoji: cards.TO_EMOJI[paper.blinding],
					text: cards.TO_TEXT[paper.blinding],
					color: cards.score_to_color(paper.scores.blinding),
					shadow: color_to_shadow(cards.score_to_color(paper.scores.blinding)),
					description: cards.TO_DESCRIPTION[paper.blinding],
					is_card: true,
				});
			}
		}

		return result;
	});

	const journal = $derived.by(() =>
	{
		if (paper.journal.id === JournalMissingReason.NotFound)
			return {
				emoji: '🤷',
				text: 'Journal not found',
				color: COLORS[Color.Gray].default,
				shadow: color_to_shadow(COLORS[Color.Gray].default),
				description: 'This paper was published in a journal that is not in the Papermap database',
			};

		if (paper.journal.id === JournalMissingReason.NotPublished)
		{
			if (paper.institution)
				return null;

			return {
				emoji: '📭',
				text: 'Not published yet',
				color: COLORS[Color.Gray].default,
				shadow: color_to_shadow(COLORS[Color.Gray].default),
				description: 'This paper has not been published in a journal yet',
			};
		}

		const journal_ = journals[paper.journal.id];

		return {
			emoji: cards.score_to_emoji(journal_.score),
			text: journal_.title,
			color: cards.score_to_color(journal_.score),
			shadow: color_to_shadow(cards.score_to_color(journal_.score)),
			journal: journal_,
		};
	});

	const retracted = $derived(paper.journal.retracted);

	const sample_size = $derived.by(() =>
	{
		if (paper.sample_size === MissingReason.NoAccess)
		{
			return {
				emoji: '🔒',
				text: 'No access',
				color: COLORS[Color.Gray].default,
				shadow: color_to_shadow(COLORS[Color.Gray].default),
				description: "The number of participants in the study is not available because we couldn't access the full text of the paper",
			};
		}

		else if (paper.sample_size === MissingReason.NotSpecified)
		{
			return {
				emoji: '🤷',
				text: 'Not specified',
				color: COLORS[Color.Gray].default,
				shadow: color_to_shadow(COLORS[Color.Gray].default),
				description: 'The paper does not specify the number of participants in the study',
			}
		}

		if (paper.sample_size === MissingReason.NotApplicable)
			return null;

		return {
			emoji: cards.sample_size_score_to_emoji(paper.scores.sample_size),
			text: int_to_text(paper.sample_size),
			color: cards.score_to_color(paper.scores.sample_size),
			shadow: color_to_shadow(cards.score_to_color(paper.scores.sample_size)),
			description: int_to_text(paper.sample_size) + ' individuals were included in this study',
		};
	});

	const p_value = $derived.by(() =>
	{
		if (paper.p_value === MissingReason.NoAccess)
		{
			return {
				emoji: '🔒',
				text: 'No access',
				color: COLORS[Color.Gray].default,
				shadow: color_to_shadow(COLORS[Color.Gray].default),
				description: "The p-value of the results is not available because we couldn't access the full text of the paper",
			};
		}

		else if (paper.p_value === MissingReason.NotSpecified)
		{
			return {
				emoji: '🤷',
				text: 'Not specified',
				color: COLORS[Color.Gray].default,
				shadow: color_to_shadow(COLORS[Color.Gray].default),
				description: 'The paper does not specify the p-value of their results',
			}
		}

		if (paper.p_value === MissingReason.NotApplicable)
			return null;

		return {
			emoji: cards.p_value_score_to_emoji(paper.scores.p_value),
			text: (paper.p_value.less_than ? ' < ' : ' ') + float_to_text(paper.p_value.value),
			color: cards.score_to_color(paper.scores.p_value),
			shadow: color_to_shadow(cards.score_to_color(paper.scores.p_value)),
			description: `There is ${paper.p_value.less_than ? 'less than' : ''} a ${float_to_text(paper.p_value.value * 100)}% probability that these results occurred by chance`,
		};
	});

	const citations = $derived.by(() =>
	{
		return {
			emoji: cards.citation_score_to_emoji(paper.scores.citations),
			text: int_to_text(paper.citations),
			color: cards.score_to_color(paper.scores.citations),
			shadow: color_to_shadow(cards.score_to_color(paper.scores.citations)),
			description: 'This paper has been cited ' + int_to_text(paper.citations) + ' times in other papers',
		}
	});

	const conflict_of_interest = $derived.by(() =>
	{
		if (paper.conflict_of_interest === MissingReason.NoAccess)
		{
			return {
				emoji: '🔒',
				text: 'No access',
				color: COLORS[Color.Gray].default,
				shadow: color_to_shadow(COLORS[Color.Gray].default),
				description: "The authors' conflict of interest is not available because we couldn't access the full text of the paper",
			};
		}

		return {
			emoji: cards.TO_EMOJI[paper.conflict_of_interest],
			text: cards.TO_TEXT[paper.conflict_of_interest],
			color: cards.conflict_of_interest_to_color(paper.conflict_of_interest),
			shadow: color_to_shadow(cards.conflict_of_interest_to_color(paper.conflict_of_interest)),
			description: cards.TO_DESCRIPTION[paper.conflict_of_interest],
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
				link: note.link,
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
					{@render emoji('✒️')}
					<span>Edit</span>
					<div class="absolute edit-mask bg-[#80000015]"></div>
				</button>
				<button
					class="delete-button relative card text-unselectable cursor-pointer overflow-hidden"
					style="--shadow-color: #80000050" onclick={delete_paper}
				>
					{@render emoji('🗑️')}
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
			<span class="subtitle unselectable">Paper result:</span>
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
					<i>{part.text}</i>
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
		{#if journal !== null}
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
		{/if}
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
						<a href={note.link} target={note.link ? '_blank' : undefined}>
							<div class="card text-unselectable" style="background-color: {note.color}; --shadow-color: {note.shadow};">
								{@render emoji(note.emoji)}
								<span>{note.text}</span>
								<div class="info-ext">
									<InfoBubble {emojis} text={note.description} link={note.link !== undefined} {width} {height}/>
								</div>
							</div>
						</a>
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
