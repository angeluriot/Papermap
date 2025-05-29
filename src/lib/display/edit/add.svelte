<script lang="ts">
	import type { Map } from '$lib/types/map';
	import { Edit, JournalStatus, NoteImpact, paper_to_datapaper, PaperType, ReviewType, StudyOn, type DataPaper, type Paper, type SearchPaperResult } from '$lib/types/paper';
	import SmallAdd from '$lib/svgs/small-add.svg';
	import SmallRemove from '$lib/svgs/small-remove.svg';
	import { TO_TEXT, TO_TEXT_PLURAL } from '../details/cards';
	import type { Journal, JournalTitle } from '$lib/types/journal';
	import Autocomplete from './autocomplete.svelte';
	import Cross from '$lib/svgs/cross.svg';
	import Link from '$lib/svgs/link.svg';
	import { score_paper } from '$lib/scoring/paper';
	import { get_label } from '../graph/points';
	import deepEqual from 'deep-equal';
	import cloneDeep from 'clone-deep';
	import Loading from '../loading.svelte';

	let { map = $bindable(), journals = $bindable(), result, paper, hide }: {
		map: Map,
		journals: { [id: string]: Journal },
		result: SearchPaperResult | null,
		paper: Paper | null,
		hide: () => void,
	} = $props();

	let id: string | null = $state(null);
	let title = $state('');
	let authors: string[] = $state(['']);
	let year: number | null = $state(null);
	let link = $state('');
	let journal_status: string = $state('');
	let journal_search = $state('');
	let journal: JournalTitle | null = $state(null);
	let retracted: boolean = $state(false);
	let consensus: string = $state('');
	let conclusion: string = $state('');
	let indirect: boolean = $state(false);
	let quote: string = $state('');
	let review_type: string = $state('');
	let review_count: number | null = $state(null);
	let type: string = $state('');
	let on: string = $state('');
	let sample_size: number | null = $state(null);
	let p_value_prefix: string = $state('');
	let p_value: number | null = $state(null);
	let citations: number | null = $state(null);
	let critics: boolean = $state(false);
	let conflict_of_interest: string = $state('');
	let notes: { title: string, description: string, impact: string }[] = $state([]);
	let loading = $state(false);

	const impact_to_text = {
		[NoteImpact.ExtremelyNegative]: 'Extremely negative',
		[NoteImpact.Positive]: 'Positive',
		[NoteImpact.Negative]: 'Negative',
		[NoteImpact.ExtremelyPositive]: 'Extremely positive',
	};

	function to_id_text(id: string, plural: boolean): string[]
	{
		if ((impact_to_text as any)[id] !== undefined)
			return [id, (impact_to_text as any)[id]];

		const text = (plural ? TO_TEXT_PLURAL as any : TO_TEXT as any)[id] as string;

		return [id, text[0] + text.slice(1).toLowerCase()];
	}

	$effect(() =>
	{
		if (result !== null)
		{
			id = cloneDeep(result.id ?? null);
			title = cloneDeep(result.title ?? '');
			authors = cloneDeep(result.authors ?? ['']);
			year = cloneDeep(result.year ?? null);
			link = cloneDeep(result.link ?? '');
			journal_status = cloneDeep(result.journal ? 'yes' : 'no');

			let temp: JournalTitle | null = result.journal ? { id: result.journal.id, title: result.journal.title } : null;

			if (temp && result.journal?.publisher)
				temp.publisher = result.journal.publisher;

			journal = cloneDeep(temp);
			retracted = cloneDeep(result.retracted ?? false);
			citations = cloneDeep(result.citations ?? null);
		}
	});

	$effect(() =>
	{
		if (paper !== null)
		{
			const journal_data = paper.journal.id ? journals[paper.journal.id] : undefined;
			let temp: JournalTitle | null = journal_data ? { id: journal_data.id, title: journal_data.title } : null;

			if (temp && journal_data?.publisher)
				temp.publisher = journal_data.publisher;

			if (paper.journal.status === JournalStatus.NotFound)
				temp = { id: 'not_found', title: '(Not found)' };

			id = cloneDeep(paper.id ?? null);
			title = cloneDeep(paper.title ?? '');
			authors = cloneDeep(paper.authors ?? ['']);
			year = cloneDeep(paper.year ?? null);
			link = cloneDeep(paper.link ?? '');
			journal_status = cloneDeep(paper.journal.status === JournalStatus.NotPublished ? 'no' : 'yes');
			journal_search = '';
			journal = cloneDeep(temp);
			retracted = cloneDeep(paper.journal.retracted ?? false);
			consensus = cloneDeep(paper.results.consensus ?? '');
			conclusion = cloneDeep(paper.results.conclusion ?? '');
			indirect = cloneDeep(paper.results.indirect ?? false);
			quote = cloneDeep(paper.quote ?? '');
			review_type = cloneDeep(paper.review?.type ?? 'null');
			review_count = cloneDeep(paper.review?.count ?? null);
			type = cloneDeep(paper.type ?? 'null');
			on = cloneDeep(paper.on ?? 'null');
			sample_size = cloneDeep(paper.sample_size ?? null);
			p_value_prefix = cloneDeep(paper.p_value ? (paper.p_value.less_than ? 'less' : 'equal') : '');
			p_value = cloneDeep(paper.p_value?.value ?? null);
			citations = cloneDeep(paper.citations?.count ?? null);
			critics = cloneDeep(paper.citations?.critics ?? false);
			conflict_of_interest = cloneDeep(paper.conflict_of_interest ? 'yes' : 'no');
			notes = cloneDeep(paper.notes ?? []);
		}
	});

	$effect(() =>
	{
		if (consensus !== '' && conclusion !== '' && map.consensus[consensus].coherence[conclusion] === undefined)
			conclusion = '';

		if (p_value !== null && p_value_prefix === '')
			p_value_prefix = 'equal';
	});

	let is_review = $derived(review_type !== '' && review_type !== 'null');
	let autocomplete_focused = $state(false);

	function is_valid()
	{
		return (
			title.trim() !== '' &&
			authors.filter(a => a.trim().length > 0).length > 0 &&
			year !== null &&
			link.trim() !== '' &&
			journal_status !== '' &&
			(journal_status === 'no' || journal !== null) &&
			consensus !== '' &&
			conclusion !== '' &&
			quote.trim() !== '' &&
			review_type !== '' &&
			(review_type === 'null' || review_count !== null) &&
			type !== '' &&
			on !== '' &&
			citations !== null &&
			conflict_of_interest !== ''
		);
	}

	async function get_journal_data(id: string): Promise<Journal | undefined>
	{
		const response = await fetch(`/journal/${id}`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		});

		if (!response.ok)
			return undefined;

		const result = await response.json() as { journal: Journal };

		return result.journal;
	}

	function create_data_paper(): DataPaper | null
	{
		if (!is_valid())
			return null;

		let journal_attribute: any = {
			retracted: retracted,
			status: JournalStatus.NotPublished
		};

		if (journal)
		{
			if (journal.id === 'not_found')
				journal_attribute.status = JournalStatus.NotFound;
			else
			{
				journal_attribute.id = journal.id;
				journal_attribute.status = JournalStatus.Found;
			}
		}

		let data_paper: DataPaper = {
			title: title.trim(),
			authors: authors.filter(author => author.trim().length > 0).map(author => author.trim()),
			year: year as number,
			link: link.trim(),
			journal: journal_attribute,
			results: {
				consensus: consensus.trim(),
				conclusion: conclusion.trim(),
				indirect: indirect,
			},
			quote: quote.trim(),
			citations: {
				count: citations as number,
				critics: critics,
			},
			conflict_of_interest: conflict_of_interest.trim() === 'yes',
			notes: notes.filter(
				note => note.title.trim() !== '' &&
				note.description.trim() !== '' &&
				Object.values(NoteImpact).includes(note.impact.trim() as NoteImpact)
			).map(note => ({
				title: note.title.trim(),
				description: note.description.trim(),
				impact: note.impact.trim() as NoteImpact,
			}))
		};

		if (id !== null && id !== '')
			data_paper.id = id;

		if (Object.values(ReviewType).includes(review_type.trim() as ReviewType))
		{
			data_paper.review = {
				type: review_type.trim() as ReviewType,
				count: review_count as number,
			};
		}

		if (Object.values(PaperType).includes(type.trim() as PaperType))
			data_paper.type = type.trim() as PaperType;

		if (Object.values(StudyOn).includes(on.trim() as StudyOn))
			data_paper.on = on.trim() as StudyOn;

		if (sample_size !== null)
			data_paper.sample_size = sample_size;

		if (p_value !== null && p_value_prefix !== '')
		{
			data_paper.p_value = {
				value: p_value,
				less_than: p_value_prefix.trim() === 'less',
			};
		}

		return data_paper;
	}

	function has_changed(): boolean
	{
		const data_paper = create_data_paper();

		if (paper === null || data_paper === null)
			return true;

		const initial = paper_to_datapaper(JSON.parse(JSON.stringify(paper)));
		const current = JSON.parse(JSON.stringify(data_paper));
		const equals = deepEqual(initial, current);

		return !equals;
	}

	async function create_paper(index: number): Promise<Paper | null>
	{
		let data_paper = create_data_paper();

		if (data_paper === null)
			return null;

		let journal_data: Journal | undefined = undefined;

		if (data_paper.journal.id !== undefined)
		{
			if (journals[data_paper.journal.id] !== undefined)
				journal_data = journals[data_paper.journal.id];
			else if (result?.journal)
				journal_data = result.journal;
			else
				journal_data = await get_journal_data(data_paper.journal.id);

			if (journal_data !== undefined && journals[journal_data.id] === undefined)
				journals[journal_data.id] = journal_data;

			if (journal_data === undefined)
			{
				delete data_paper.journal.id;
				data_paper.journal.status = JournalStatus.NotFound;
			}
		}

		return score_paper(map, journal_data, data_paper, index);
	}

	async function add_paper()
	{
		if (loading)
			return;

		loading = true;

		let final_paper = await create_paper(-1);

		if (final_paper === null)
		{
			loading = false;
			return;
		}

		final_paper.edit = Edit.Added;
		map.papers[final_paper.uuid] = final_paper;
		loading = false;
		hide();
	}

	async function edit_paper()
	{
		if (loading)
			return;

		loading = true;

		if (paper === null)
		{
			loading = false;
			return;
		}

		let final_paper = await create_paper(paper.index);

		if (final_paper === null)
		{
			loading = false;
			return;
		}

		final_paper.uuid = paper.uuid;

		if (paper.edit === Edit.Added)
			final_paper.edit = Edit.Added;
		else
			final_paper.edit = Edit.Edited;

		map.papers[final_paper.uuid] = final_paper;
		loading = false;
		hide();
	}
</script>

<div class="add-container flex flex-col justify-start items-center">
	<div class="title flex-center-col">
		<h1 class="unselectable">
			{#if paper == null}
				Add a new paper
			{:else}
				Edit "{get_label(paper).replace('\n', ' ').trim()}"
			{/if}
		</h1>
		<a href="https://a.com" target="_blank" class="help flex-center-row">
			<img src={Link} alt="link" class="img-unselectable"/>
			<span class="unselectable">
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;How to {#if paper == null}add{:else}edit{/if} a paper?
			</span>
		</a>
	</div>
	<div class="input">
		<div class="label unselectable flex-center-row">
			<span>Title</span>
			<span class="required">*</span>
		</div>
		<input bind:value={title} type="text" placeholder="The title of the paper"/>
	</div>
	<div class="input">
		<div class="label unselectable flex-center-row">
			<span>Authors</span>
			<span class="required">*</span>
		</div>
		{#each authors as _, i}
			<div class="input-button flex-center-row w-full">
				<input bind:value={authors[i]} type="text" placeholder="The full name of the author"/>
				{#if i > 0}
					<div
						class="rounded-full"
						onclick={() => authors.splice(i, 1)}
						onkeydown={null} role="button" tabindex={i}
					>
						<img class="remove rounded-full img-unselectable" src={SmallRemove} alt="remove"/>
					</div>
				{/if}
			</div>
		{/each}
		{#if authors.length < 4}
			<div
				class="rounded-full"
				onclick={() => authors.push('')}
				onkeydown={null} role="button" tabindex={0}
			>
				<img class="add rounded-full img-unselectable" src={SmallAdd} alt="add"/>
			</div>
		{/if}
	</div>
	<div class="input">
		<div class="label unselectable flex-center-row">
			<span>Year</span>
			<span class="required">*</span>
		</div>
		<input bind:value={year} type="number" min=1500 max={new Date().getFullYear() + 1} placeholder="The year of publication"/>
	</div>
	<div class="input">
		<div class="label unselectable flex-center-row">
			<span>Link</span>
			<span class="required">*</span>
		</div>
		<input bind:value={link} type="text" placeholder="A link to the paper (a DOI link if possible)"/>
	</div>
	<div class="input">
		<div class="label unselectable flex-center-row">
			<span>Has been published</span>
			<span class="required">*</span>
		</div>
		<select bind:value={journal_status}>
			<option value="" disabled selected hidden></option>
			<option value="yes">Yes</option>
			<option value="no">No (preprint)</option>
		</select>
	</div>
	{#if journal_status == 'yes'}
		<div class="input">
			<div class="label unselectable flex-center-row">
				<span>Journal</span>
				<span class="required">*</span>
			</div>
			<div class="journal-container relative w-full">
				{#if journal !== null}
					<div class="journal flex flew-row justify-between items-center">
						<span class="unselectable">{journal.title}</span>
						<div class="journal-remove" onclick={() => journal = null} onkeydown={null} role="button" tabindex={0}>
							<img src={Cross} alt="remove" class="img-unselectable"/>
						</div>
					</div>
				{:else}
					<input
						class="relative" bind:value={journal_search} onfocusin={() => autocomplete_focused = true} onfocusout={() => autocomplete_focused = false}
						type="text" placeholder="Search for the journal"
					/>
					<div class="autocomplete-container absolute w-full left-0">
						<Autocomplete search={journal_search} bind:journal={journal} focused={autocomplete_focused}/>
					</div>
				{/if}
			</div>
		</div>
		<div class="input checkbox">
			<input bind:checked={retracted} type="checkbox"/>
			<div
				class="label" role="button" tabindex={0} onkeydown={null}
				onclick={() => { retracted = !retracted; }}
			>
				<span class="unselectable">Retracted</span>
				<span class="optional unselectable">(Has the journal retracted the paper?)</span>
			</div>
		</div>
	{/if}
	<div class="input">
		<div class="label unselectable flex-center-row">
			<span>Citations</span>
			<span class="required">*</span>
		</div>
		<input bind:value={citations} type="number" min=0 placeholder="The number of times the paper has been cited"/>
	</div>
	<div class="input checkbox">
		<input bind:checked={critics} type="checkbox"/>
		<div
			class="label" role="button" tabindex={0} onkeydown={null}
			onclick={() => { critics = !critics; }}
		>
			<span class="unselectable">Mostly critics</span>
			<span class="optional unselectable">(Most of the citations are critical of the paper)</span>
		</div>
	</div>
	<div class="input">
		<div class="label unselectable flex-center-row">
			<span>Previous consensus</span>
			<span class="required">*</span>
		</div>
		<div class="sublabel unselectable">
			<span>The consensus in literature according to the paper (if any)</span>
		</div>
		<select bind:value={consensus}>
			<option value="" disabled selected hidden></option>
			{#each Object.entries(map.consensus) as [id, c]}
				<option value={id}>{c.text}</option>
			{/each}
		</select>
	</div>
	{#if consensus !== ''}
		<div class="input">
			<div class="label unselectable flex-center-row">
				<span>Paper result</span>
				<span class="required">*</span>
			</div>
			<div class="sublabel unselectable">
				<span>The conclusion of the paper</span>
			</div>
			<select bind:value={conclusion}>
				<option value="" disabled selected hidden></option>
				{#each Object.keys(map.consensus[consensus].coherence) as id}
					<option value={id}>{map.conclusions[id].text}</option>
				{/each}
			</select>
		</div>
		<div class="input checkbox">
			<input bind:checked={indirect} type="checkbox"/>
			<div
				class="label" role="button" tabindex={0} onkeydown={null}
				onclick={() => { indirect = !indirect; }}
			>
				<span class="unselectable">Indirect result</span>
				<span class="optional unselectable">(This conclusion is based on indirect evidence from the paper)</span>
			</div>
		</div>
	{/if}
	<div class="input">
		<div class="label unselectable">
			<span>Quote</span>
			<span class="required">*</span>
		</div>
		<textarea bind:value={quote} placeholder={'A short quote from the paper that supports the conclusion (use "[...]" if needed)'}></textarea>
	</div>
	<div class="input">
		<div class="label unselectable flex-center-row">
			<span>Review type</span>
			<span class="required">*</span>
		</div>
		<select bind:value={review_type}>
			<option value="" disabled selected hidden></option>
			<option value="null">(Not a literature review)</option>
			{#each Object.values(ReviewType).map(id => to_id_text(id, false)) as [id, text]}
				<option value={id}>{text}</option>
			{/each}
		</select>
	</div>
	{#if is_review}
		<div class="input">
			<div class="label unselectable flex-center-row">
				<span>Number of papers included</span>
				<span class="required">*</span>
			</div>
			<input bind:value={review_count} type="number" min=0 placeholder="The number of papers included in the review"/>
		</div>
	{/if}
	<div class="input">
		<div class="label unselectable flex-center-row">
			{#if is_review}
				<span>Study type of most papers</span>
			{:else}
				<span>Study type</span>
			{/if}
			<span class="required">*</span>
		</div>
		<select bind:value={type}>
			<option value="" disabled selected hidden></option>
			<option value="null">(No specific type{#if is_review}s{/if})</option>
			{#each Object.values(PaperType).map(id => to_id_text(id, is_review)) as [id, text]}
				<option value={id}>{text}</option>
			{/each}
		</select>
	</div>
	<div class="input">
		<div class="label unselectable flex-center-row">
			<span>Subjects {#if is_review}in most papers{/if}</span>
			<span class="required">*</span>
		</div>
		<select bind:value={on}>
			<option value="" disabled selected hidden></option>
			<option value="null">(Not applicable)</option>
			{#each Object.values(StudyOn).map(id => to_id_text(id, false)) as [id, text]}
				<option value={id}>{text}</option>
			{/each}
		</select>
	</div>
	<div class="input">
		<div class="label unselectable">
			<span>{#if is_review}Total sample{:else}Sample{/if} size</span>
			<span class="optional unselectable">(optional)</span>
		</div>
		<input
			bind:value={sample_size} type="number" min=1
			placeholder={is_review ? 'The total number of participants in the included papers' : 'The number of participants in the study'}
		/>
	</div>
	<div class="input">
		<div class="label unselectable">
			<span>P-value</span>
			<span class="optional unselectable">(optional)</span>
		</div>
		<div class="w-full flex-center-row" style="gap: 0.5em;">
			<select bind:value={p_value_prefix} style="width: 4em;">
				<option value="" disabled selected hidden></option>
				<option value="equal">=</option>
				<option value="less">{'<'}</option>
			</select>
			<input bind:value={p_value} type="number" min=0 max=1 step=0.01 placeholder="The p-value of the results"/>
		</div>
	</div>
	<div class="input">
		<div class="label unselectable flex-center-row">
			<span>Conflict of interest</span>
			<span class="required">*</span>
		</div>
		<select bind:value={conflict_of_interest}>
			<option value="" disabled selected hidden></option>
			<option value="no">No</option>
			<option value="yes">Yes</option>
		</select>
	</div>
	<div class="input">
		<div class="label unselectable">
			<span>Notes</span>
			<span class="optional unselectable">(optional)</span>
		</div>
		{#each notes as _, i}
			<div class="input-button flex-center-row w-full">
				<div class="flex flex-col justify-start items-start w-full" style="gap: 0.5em;">
					<div class="sublabel unselectable">
						<span>Title</span>
					</div>
					<input bind:value={notes[i].title} type="text" placeholder="The title of the note"/>
					<div class="sublabel unselectable">
						<span>Description</span>
					</div>
					<textarea class="small" bind:value={notes[i].description} placeholder="A short description of the note"></textarea>
					<div class="sublabel unselectable">
						<span>Impact on the paper score</span>
					</div>
					<select bind:value={notes[i].impact}>
						<option value="" disabled selected hidden></option>
						{#each Object.values(NoteImpact).map(id => to_id_text(id, false)) as [id, text]}
							<option value={id}>{text}</option>
						{/each}
					</select>
				</div>
				<div
					class="rounded-full"
					onclick={() => notes.splice(i, 1)}
					onkeydown={null} role="button" tabindex={i}
				>
					<img class="remove rounded-full img-unselectable" src={SmallRemove} alt="remove"/>
				</div>
			</div>
			<div style="height: {i < notes.length - 1 ? '0.5em' : '0em'};"></div>
		{/each}
		{#if notes.length < 5}
			<div
				class="rounded-full"
				onclick={() => notes.push({title: '', description: '', impact:''})}
				onkeydown={null} role="button" tabindex={0}
			>
				<img class="add rounded-full img-unselectable" src={SmallAdd} alt="add"/>
			</div>
		{/if}
	</div>
	{#if paper === null}
		<button
			class="button flex-center-col relative {is_valid() ? '' : 'disabled'}"
			style="{loading ? 'pointer-events: none;' : ''}" onclick={add_paper}>
			<span class="unselectable" style="{loading ? 'opacity: 0;' : ''}">
				Add the paper
			</span>
			{#if loading}
				<div class="loading">
					<Loading color="#31375b"/>
				</div>
			{/if}
		</button>
	{:else}
		<button
			class="button flex-center-col relative {is_valid() && has_changed() ? '' : 'disabled'}"
			style="{loading ? 'pointer-events: none;' : ''}" onclick={edit_paper}>
			<span class="unselectable" style="{loading ? 'opacity: 0;' : ''}">
				Edit the paper
			</span>
			{#if loading}
				<div class="loading">
					<Loading color="#31375b"/>
				</div>
			{/if}
		</button>
	{/if}
</div>

<style>
	.add-container
	{
		padding: 0.2em var(--padding-size);
		gap: 1.5em;
		width: 100%;
		max-height: 50em;
		overflow-y: auto;
		overflow-x: hidden;
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	.add-container::-webkit-scrollbar
	{
		display: none;
	}

	.title
	{
		margin-bottom: 0.5em;
		gap: 0.2em;
	}

	h1
	{
		color: #303037;
		font-size: 1.25em;
		font-family: Satoshi-Variable, sans-serif;
		font-weight: 500;
		line-height: 1.5em;
	}

	.help
	{
		font-family: Satoshi-Variable, sans-serif;
		line-height: 1.5em;
		font-weight: 500;
		color: #9193a2;
	}

	.help:hover
	{
		text-decoration: underline;
	}

	.help img
	{
		width: 0.95em;
		height: 0.95em;
		margin-top: -0.15em;
		margin-right: -0.95em;
	}

	.input
	{
		width: 100%;
		max-width: calc(100vw - 3em);
		display: flex;
		flex-direction: column;
		justify-content: start;
		align-items: start;
		color: #303037;
		gap: 0.5em;
	}

	.input .label
	{
		font-family: Satoshi-Variable, sans-serif;
		font-weight: 500;
		line-height: 1.5em;
		border-radius: 0.5em;
		margin-left: 0.2em;
		margin-bottom: -0.5em;
	}

	.required
	{
		font-weight: 800;
		font-size: 1.3em;
		line-height: 0.5em;
		color: #ff2b2b;
		margin-bottom: 0.2em;
	}

	.label .optional
	{
		font-weight: 450;
		color: rgb(144, 144, 163);
		font-style: italic;
	}

	.sublabel
	{
		font-family: Satoshi-Variable, sans-serif;
		line-height: 1.2em;
		font-weight: 450;
		color: rgb(144, 144, 163);
		margin-top: -0.1em;
		margin-left: 0.2em;
		margin-bottom: -0.15em;
	}

	.input input, .input textarea, .input select
	{
		width: 100%;
		border-color: #dbdbe8;
		border-width: 0.145em;
		background-color: #fbfbfd;
		padding: 0.4em 0.6em;
		font-family: Satoshi-Variable, sans-serif;
		font-weight: 465;
		line-height: 1.5em;
		border-radius: 0.5em;
		color: #4d4d5c;
	}

	.input select option
	{
		font-weight: 500;
	}

	.input textarea
	{
		resize: none;
		height: 8em;
	}

	.input input:focus, .input textarea:focus
	{
		outline: none;
		border-color: rgb(173, 173, 194);
		border-width: 0.145em;
	}

	.input input::placeholder, .input textarea::placeholder
	{
		color: rgb(173, 173, 194);
		pointer-events: none;
		user-select: none;
		-moz-user-select: none;
		-webkit-user-drag: none;
		-webkit-user-select: none;
		-ms-user-select: none;
		-o-user-select: none;
	}

	textarea.small
	{
		height: 5em;
	}

	.input .input-button
	{
		gap: 0.5em;
	}

	.input img
	{
		cursor: pointer;
		width: 1.6em;
		height: 1.6em;
	}

	.checkbox
	{
		display: flex;
		flex-direction: row;
		justify-content: start;
		align-items: center;
		margin-top: -1em;
		margin-left: 0.5em;
		margin-bottom: 0.4em;
		gap: 0.25em;
	}

	.checkbox .label
	{
		line-height: 1.2em;
	}

	.checkbox input
	{
		width: 1.1em;
		height: 1.1em;
		margin-bottom: -0.4em;
		cursor: pointer;
		border-color: #dbdbe8;
		border-width: 0.145em;
		background-color: #fbfbfd;
	}

	.autocomplete-container
	{
		display: none;
	}

	.journal-container:focus-within .autocomplete-container
	{
		display: block;
	}

	.journal
	{
		width: 100%;
		border-color: #dbdbe8;
		border-width: 0.145em;
		background-color: #ededf3;
		padding: 0.4em 0.6em;
		font-family: Satoshi-Variable, sans-serif;
		font-weight: 465;
		line-height: 1.5em;
		border-radius: 0.5em;
		color: #4d4d5c;
	}

	.journal-remove
	{
		cursor: pointer;
		padding: 0.5em;
		margin: -0.3em;
	}

	.journal-remove img
	{
		width: 0.87em;
		height: 0.87em;
	}

	.button
	{
		cursor: pointer;
		max-width: 15em;
		border-width: 0.145em;
		font-family: Satoshi-Variable, sans-serif;
		font-weight: 475;
		line-height: 1.5em;
		border-radius: 1.5em;
		width: 100%;
		min-height: 4em;
		padding: 0.5em 1em;
		transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, color 0.2s ease-in-out;
		margin-top: 1em;
		background-color: rgb(122, 243, 191);
		border-color: rgb(86, 200, 162);
		color: rgb(27, 82, 78);
	}

	.button:hover
	{
		background-color: rgb(110, 231, 186);
	}

	.disabled
	{
		pointer-events: none;
		background-color: rgb(240, 240, 247);
		border-style: dashed;
		border-color: rgb(211, 212, 232);
		color: rgb(155, 155, 183);
	}

	.loading
	{
		font-size: 0.5em;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
