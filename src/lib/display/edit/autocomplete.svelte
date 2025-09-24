<script lang="ts">
	import type { JournalTitle } from '$lib/types/journal';
	import { sleep_until } from '$lib/utils';
	import { clean_id } from '$lib/utils';

	let { search, journal = $bindable(), focused }: {
		search: string,
		journal: JournalTitle | null,
		focused: boolean,
	} = $props();

	let freeze: Date = new Date();
	let journal_results: JournalTitle[] = $state([]);
	let selected_i: number | null = $state(null);

	async function get_journals(search_: string): Promise<JournalTitle[] | null>
	{
		if (freeze > new Date())
			await sleep_until(freeze);

		if (search_ !== search)
			return null;

		const response = await fetch('https://api.openalex.org/autocomplete/sources?filter=type:journal&q=' + encodeURIComponent(search_));

		if (!response.ok)
			return [];

		const result = await response.json();

		const res = result.results.map((source: any) =>
			({
				id: source?.id && source.id.trim().length > 0 ? clean_id(source.id) : undefined,
				title: source?.display_name && source.display_name.trim().length > 0 ? source.display_name : undefined,
				publisher: source?.hint && !['host organization unknown', ''].includes(source.hint.toLowerCase().trim()) ? source.hint : undefined,
			})).filter((journal: any) => journal.id && journal.title);

		res.push({
			id: 'not_found',
			title: '(Not found)',
		});

		freeze = new Date(Date.now() + 1000);

		return res;
	}

	$effect(() =>
	{
		get_journals(search).then((result) =>
		{
			if (result !== null)
			{
				journal_results = result;
				selected_i = null;
			}
		});
	});

	function select_journal(i: number)
	{
		journal = journal_results[i];
	}

	$effect(() =>
	{
		if (!focused)
			selected_i = null;
	});

	function handle_key_press(event: KeyboardEvent)
	{
		if (!focused)
			return;

		if (event.key === 'ArrowDown')
		{
			selected_i = selected_i === null ? 0 : (selected_i + 1) % journal_results.length;
			event.preventDefault();
		}

		else if (event.key === 'ArrowUp')
		{
			selected_i = selected_i === null ? journal_results.length - 1 : (selected_i - 1 + journal_results.length) % journal_results.length;
			event.preventDefault();
		}

		else if (event.key === 'Enter' && selected_i !== null)
		{
			select_journal(selected_i);
			event.preventDefault();
		}
	}
</script>

<svelte:window onkeydown={handle_key_press}/>

<div class="autocomplete w-full">
	{#each journal_results as j, i}
		<div
			class="line cursor-pointer"
			style="{i == 0 ? 'padding-top: 0.5em;' : ''} {i == journal_results.length - 1 ? 'padding-bottom: 0.5em;' : ''} {selected_i == i ? 'background-color: #dbdbe8a0;' : ''}"
			onmouseenter={() => selected_i = i} role="button" tabindex={i}
			onclick={() => select_journal(i)} onkeydown={null}
		>
			<div class="unselectable">
				<span class="title">{j.title}</span>
				{#if j.publisher}
					<span class="publisher">({j.publisher})</span>
				{/if}
			</div>
		</div>
	{/each}
</div>

<style>
	.autocomplete
	{
		background-color: white;
		border-color: #dbdbe8;
		border-width: 0.145em;
		border-radius: 0.5em 0.5em 1em 1em;
	}

	.line
	{
		padding: 0.3em 0.7em;
	}

	span
	{
		font-family: Satoshi-Variable, sans-serif;
		font-weight: 465;
		line-height: 1.5em;
		color: #4d4d5c;
	}

	.publisher
	{
		opacity: 0.4;
		font-style: italic;
	}
</style>
