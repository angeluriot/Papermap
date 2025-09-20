<script lang="ts">
	import type { PageProps } from './$types';
	import { constants as C } from '$lib/utils';
	import Background from '$lib/list/background.svelte';
	import Home from '$lib/svgs/home.svg';
	import Random from '$lib/svgs/random.svg';
	import Scatter from '$lib/statistics/scatter.svelte';
	import Bars from '$lib/statistics/bars.svelte';
	import { get_label } from '$lib/display/graph/points';
	import Categories from '$lib/statistics/categories.svelte';
	import { Blinding, ConflictOfInterest, MissingReason, PaperType, ReviewedPapersBlinding, ReviewedPapersType, ReviewType, type Paper } from '$lib/types/paper';
	import { TO_TEXT } from '$lib/display/details/cards';
	import { REVIEW_COUNT_SUBPART_RATIO, REVIEW_COUNT_ESTIMATE_RATIO, REVIEW_OF_REVIEWS_MULTIPLIER, COEFS } from '$lib/scoring/paper';
	import { float_to_text, int_to_text } from '$lib/display/utils';

	const { data }: PageProps = $props();
	const { emojis, maps } = data;

	const title = 'Papermap statistics';
	const description = 'Statistics about the papers currently registered on Papermap.';
	const preview = `${C.BASE_URL}/images/preview.png`;
	const tags = C.DEFAULT_TAGS.concat(['statistics', 'graphs', 'data']);
	const page_url = `${C.BASE_URL}/statistics`;
	let width = $state(0);
	let height = $state(0);
	let page_height = $state(0);

	const papers = maps.flatMap(m => Object.values(m.papers));

	const types_dict = {
		[PaperType.InVitroStudy]: 'In\nVitro',
		[PaperType.CaseReport]: 'Case\nReport',
		[PaperType.AnimalStudy]: 'Animal\nStudy',
		[PaperType.EcologicalStudy]: 'Ecological\nStudy',
		[PaperType.CrossSectionalStudy]: 'Cross-\nSectional',
		[PaperType.CaseControlStudy]: 'Case-\nControl',
		[PaperType.CohortStudy]: 'Cohort\nStudy',
		[PaperType.ClinicalTrial]: 'Clinical\nTrial',
		[PaperType.RandomizedControlledTrial]: 'RCT',
		[PaperType.Other]: 'Other',
		[ReviewedPapersType.DiverseObservationalStudies]: 'Other',
		[ReviewedPapersType.DiverseClinicalTrials]: 'Other',
		[ReviewedPapersType.DiverseHumanStudies]: 'Other',
		[ReviewedPapersType.DiverseTypes]: 'Other',
	}

	const blinding_dict = {
		[Blinding.None]: 'None',
		[Blinding.Single]: 'Single',
		[Blinding.Double]: 'Double',
		[ReviewedPapersBlinding.DiverseBlinding]: 'Other',
	}

	const conflict_of_interest_dict = {
		[ConflictOfInterest.Yes]: 'Yes',
		[ConflictOfInterest.SomeLinks]: 'Some links',
		[ConflictOfInterest.YesButOppositeResults]: 'Yes but\nopposite results',
		[ConflictOfInterest.None]: 'None',
	}

	function get_review_count(paper: Paper): number | undefined
	{
		if (!paper.review || paper.review.count === MissingReason.NoAccess)
			return undefined;

		let count = paper.review.count;

		count *= paper.review.reviews ? REVIEW_OF_REVIEWS_MULTIPLIER : 1.0;
		count *= paper.review.estimate ? REVIEW_COUNT_ESTIMATE_RATIO : 1.0;
		count *= paper.review.subpart ? REVIEW_COUNT_SUBPART_RATIO : 1.0;

		return Math.round(count);
	}

	function get_review_count_text(paper: Paper): string | undefined
	{
		if (!paper.review || paper.review.count === MissingReason.NoAccess)
			return undefined;

		const count = paper.review.count;
		const reviews = paper.review.reviews ? ' (reviews)' : '';
		const estimate = paper.review.estimate ? '≈' : '';
		const subpart = paper.review.subpart ? ' (minor topic)' : '';

		return `${estimate}${count}${reviews}${subpart}`;
	}
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height}/>

{#snippet emoji(emoji: string)}
	<div class="emoji">{@html emojis[emoji]}</div>
{/snippet}

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

<div class="page-container absolute flex flex-col justify-start items-center w-full h-full overflow-x-hidden bg-[#f3f4ff]">
	<div class="absolute z-0">
		<Background {width} {height} {page_height}/>
	</div>
	<div class="main flex-center-col z-100" bind:clientHeight={page_height}>
		<div class="header w-full flex flex-row justify-between items-start">
			<div class="title flex-center-row">
				{@render emoji('📊')}
				<h1>Statistics</h1>
			</div>
			<div class="links flex-center-row">
				<a href="/maps/random">
					<img src={Random} alt="Random map" title="Random map" class="img-unselectable"/>
				</a>
				<a href="/">
					<img src={Home} alt="Home" title="Home" class="img-unselectable"/>
				</a>
			</div>
		</div>
		<div class="main-stats flex flex-row flex-wrap justify-start items-start w-full">
			{#each [
				{ label: 'Total maps', value: int_to_text(maps.length) },
				{ label: 'Total papers', value: int_to_text(papers.length) },
				{ label: 'Mean papers per map', value: int_to_text(Math.round(papers.length / maps.length)) },
				{ label: 'Mean paper score', value: float_to_text(papers.reduce((a, b) => a + b.score, 0) / papers.length) },
				{ label: 'Lowest paper score', value: float_to_text(Math.min(...papers.map(p => p.score))) },
				{ label: 'Highest paper score', value: float_to_text(Math.max(...papers.map(p => p.score))) },
			] as stat}
				<div class="main-stat flex flex-col">
					<span class="main-stat-label">{stat.label}:</span>
					<span class="main-stat-value">{stat.value}</span>
				</div>
			{/each}
		</div>
		<div class="list flex flex-row flex-wrap justify-start items-start w-full">
			<div class="graph">
				<Scatter
					title='Paper score by year' x_axis_label='Year' x_axis_max={new Date().getFullYear()} years={true} color='#5470c6'
					data={papers.map(paper => ({ x: paper.year, y: paper.score, text: get_label(paper, false), score: paper.scores.year }))}
				/>
			</div>
			<div class="graph">
				<Bars
					title='Papers by year score' x_axis_label='Year score' color='#5470c6'
					data={papers.map(paper => paper.scores.year)} scoring={COEFS.year.no_review}
				/>
			</div>
			<div class="graph">
				<Scatter
					title='Paper score by journal score' x_axis_label='Journal score' color='#91cc75'
					data={
						papers.filter(paper => paper.scores.journal !== undefined)
						.map(paper => ({
							x: paper.scores.journal,
							y: paper.score,
							text: get_label(paper, false),
						})) as { x: number, y: number, text: string }[]
					}
				/>
			</div>
			<div class="graph">
				<Bars
					title='Papers by journal score' x_axis_label='Journal score' color='#91cc75'
					data={papers.filter(paper => paper.scores.journal !== undefined).map(paper => paper.scores.journal) as number[]}
					scoring={COEFS.journal}
				/>
			</div>
			<div class="graph">
				<Scatter
					title='Paper score by citations' x_axis_label='Citations' color='#fac858' log_base={10} x_axis_max={4000}
					data={papers.map(paper => ({ x: paper.citations, y: paper.score, text: get_label(paper, false), score: paper.scores.citations }))}
				/>
			</div>
			<div class="graph">
				<Bars
					title='Papers by citations score' x_axis_label='Citations score' color='#fac858'
					data={papers.map(paper => paper.scores.citations)}
					scoring={COEFS.citations}
				/>
			</div>
			<div class="graph">
				<Categories
					title='Paper score by result type' x_label='Result type' x_axis_values={['Indirect results', 'Direct results']} jitter={0.25} color='#ee6666'
					data={
						papers.map(paper => ({
							x: paper.results.indirect ? 'Indirect results' : 'Direct results',
							y: paper.score,
							text: get_label(paper, false),
							score: paper.scores.direct,
						}))
					}
				/>
			</div>
			<div class="graph">
				<Bars
					title='Papers by result type score' x_axis_label='Result type score' color='#ee6666'
					data={papers.map(paper => paper.scores.direct)}
					scoring={COEFS.direct}
				/>
			</div>
			<div class="graph">
				<Categories
					title='Paper score by literature review type' x_label='Review' jitter={0.1} color='#73c0de' x_axis_multiline={true}
					x_axis_values={(Object.keys(ReviewType) as ReviewType[]).map(key => TO_TEXT[key].replaceAll(' ', '\n'))}
					data={
						papers.filter(paper => paper.review)
						.map(paper => ({
							x: paper.review ? TO_TEXT[paper.review.type].replaceAll(' ', '\n') : '',
							y: paper.score,
							text: get_label(paper, false),
							score: paper.scores.review ?? 0,
						}))
					}
				/>
			</div>
			<div class="graph">
				<Bars
					title='Papers by literature review score (type + size)' x_axis_label='Literature review score (type + size)' color='#73c0de'
					data={papers.filter(paper => paper.review).map(paper => paper.scores.review ?? 0)}
					scoring={COEFS.review}
				/>
			</div>
			<div class="graph">
				<Scatter
					title='Paper score by literature review size' x_axis_label='Reviewed papers' color='#3ba272' log_base={2} x_axis_max={1000}
					data={
						papers.filter(paper => get_review_count(paper) !== undefined)
						.map(paper => ({
							// @ts-ignore
							x: get_review_count(paper),
							y: paper.score,
							text: get_label(paper, false),
							score: paper.scores.review_count ?? 0,
							x_text: get_review_count_text(paper),
						})) as { x: number, y: number, text: string , score: number, x_text: string }[]
					}
				/>
			</div>
			<div class="graph">
				<Bars
					title='Papers by literature review score (size only)' x_axis_label='Literature review score (size only)' color='#3ba272'
					data={
						papers.filter(paper => paper.review && paper.review.count !== MissingReason.NoAccess)
						.map(paper => paper.scores.review_count) as number[]
					}
				/>
			</div>
			<div class="graph">
				<Categories
					title='Paper score by study type' x_label='Study type' jitter={0.04} color='#fc8452' x_axis_multiline={true}
					x_axis_values={Array.from(new Set(Object.values(types_dict)))}
					data={
						papers.filter(paper => paper.type !== MissingReason.NoAccess)
						.map(paper => ({
							x: types_dict[paper.type as PaperType | ReviewedPapersType],
							y: paper.score,
							text: get_label(paper, false),
							score: paper.scores.type ?? 0,
						}))
					}
				/>
			</div>
			<div class="graph">
				<Bars
					title='Papers by study type score' x_axis_label='Study type score' color='#fc8452'
					data={
						papers.filter(paper => paper.type !== MissingReason.NoAccess && paper.scores.type !== undefined)
						.map(paper => paper.scores.type ?? 0)
					}
					scoring={COEFS.type.effect}
				/>
			</div>
			<div class="graph">
				<Categories
					title='Paper score by blinding method' x_label='Blinding method' jitter={0.1} color='#9a60b4'
					x_axis_values={Object.values(blinding_dict)}
					data={
						papers.filter(paper => paper.blinding !== MissingReason.NoAccess)
						.map(paper => ({
							// @ts-ignore
							x: blinding_dict[paper.blinding],
							y: paper.score,
							text: get_label(paper, false),
							score: paper.scores.blinding ?? 0
						}))
					}
				/>
			</div>
			<div class="graph">
				<Bars
					title='Papers by blinding score' x_axis_label='Blinding score' color='#9a60b4'
					data={
						papers.filter(paper => paper.blinding !== MissingReason.NoAccess && paper.scores.blinding !== undefined)
						.map(paper => paper.scores.blinding ?? 0)
					}
					scoring={COEFS.blinding.effect}
				/>
			</div>
			<div class="graph">
				<Scatter
					title='Paper score by sample size' x_axis_label='Sample size' color='#ea7ccc' log_base={10} x_axis_max={100000000}
					data={
						papers.filter(paper => typeof paper.sample_size === 'number')
						.map(paper => ({
							x: paper.sample_size,
							y: paper.score,
							text: get_label(paper, false),
							score: paper.scores.sample_size ?? 0,
						})) as { x: number, y: number, text: string, score: number }[]
					}
				/>
			</div>
			<div class="graph">
				<Bars
					title='Papers by sample size score' x_axis_label='Sample size score' color='#ea7ccc'
					data={
						papers.filter(paper => paper.sample_size !== MissingReason.NoAccess && paper.sample_size !== MissingReason.NotApplicable)
						.map(paper => paper.scores.sample_size) as number[]
					}
					scoring={COEFS.sample_size.effect}
				/>
			</div>
			<div class="graph">
				<Scatter
					title='Paper score by p-value' x_axis_label='P-value' color='#5470c6' log_base={10} x_axis_max={0.1} inverse={true}
					data={
						papers.filter(paper => typeof paper.p_value === 'object')
						.map(paper => ({
							// @ts-ignore
							x: paper.p_value.value / (paper.p_value.less_than ? 2 : 1),
							y: paper.score,
							text: get_label(paper, false),
							score: paper.scores.p_value ?? 0,
							x_text: typeof paper.p_value === 'object' ? (paper.p_value.less_than ? '<' : '') + `${float_to_text(paper.p_value.value)}` : '',
						})) as { x: number, y: number, text: string, score: number, x_text: string }[]
					}
				/>
			</div>
			<div class="graph">
				<Bars
					title='Papers by p-value score' x_axis_label='P-value score' color='#5470c6'
					data={
						papers.filter(paper => paper.p_value !== MissingReason.NoAccess && paper.p_value !== MissingReason.NotApplicable)
						.map(paper => paper.scores.p_value) as number[]
					}
					scoring={COEFS.p_value}
				/>
			</div>
			<div class="graph">
				<Categories
					title='Paper score by conflict of interest' x_label='Conflict of interest' jitter={0.1} color='#91cc75' x_axis_multiline={true}
					x_axis_values={Object.values(conflict_of_interest_dict)}
					data={
						papers.filter(paper => paper.conflict_of_interest !== MissingReason.NoAccess)
						.map(paper => ({
							// @ts-ignore
							x: conflict_of_interest_dict[paper.conflict_of_interest],
							y: paper.score,
							text: get_label(paper, false),
							score: paper.scores.conflict_of_interest,
						}))
					}
				/>
			</div>
			<div class="graph">
				<Bars
					title='Papers by conflict of interest score' x_axis_label='Conflict of interest score' color='#91cc75'
					data={
						papers.filter(paper => paper.conflict_of_interest !== MissingReason.NoAccess)
						.map(paper => paper.scores.conflict_of_interest)
					}
					scoring={COEFS.conflict_of_interest.no_narrative_review}
				/>
			</div>
		</div>
	</div>
</div>

<style>
	.page-container
	{
		font-size: clamp(11px, calc(calc(0.15vw + 5px) * 2), 16px);
		padding: 2em 0em;
	}

	.main
	{
		gap: 4em;
		width: 100em;
		max-width: calc(100vw - 6em);
	}

	.main-stats
	{
		gap: 2.5em 3em;
		font-size: 1.1em;
		font-family: Satoshi-Variable, sans-serif;
		font-weight: 600;
		line-height: 1.25em;
		text-wrap: nowrap;
		color: #303037;
	}

	.main-stat
	{
		gap: 0.6em;
	}

	.main-stat-value
	{
		font-size: 1.6em;
		font-weight: 650;
	}

	.list
	{
		width: calc(100% + 0.5em);
		margin-left: -0.6em;
		position: relative;
		gap: 1em 1.5em;
	}

	.graph
	{
		width: calc(50% - 0.75em);
		height: 25em;
	}

	.header
	{
		font-size: 1.85em;
		font-family: Satoshi-Variable, sans-serif;
		font-weight: 550;
		line-height: 1.25em;
		text-wrap: nowrap;
		color: #303037;
		gap: 0.3em;
		margin-top: 0.5em;
		margin-bottom: -0.2em;
	}

	.title
	{
		gap: 0.3em;
	}

	.links
	{
		gap: 0.6em;
		margin-top: -0.2em;
		filter: drop-shadow(0em 0.1em 0.5em #00008036);
		transform: translateZ(0);
	}

	.links img
	{
		width: 1.9em;
		height: 1.9em;
		transition: transform 0.2s ease-in-out;
	}

	.links img:hover
	{
		transform: scale(1.06);
	}

	.links img:active
	{
		transition: none;
		transform: scale(1);
	}

	@media screen and (max-width: 375px)
	{
		.main
		{
			max-width: calc(100vw - 4em);
		}
	}

	@media screen and (max-width: 950px)
	{
		.graph
		{
			width: 100%;
			height: calc(20em + 10vw);
		}
	}

	.emoji
	{
		width: 1.15em;
		height: 1.15em;
	}
</style>
