import type { Journal } from '$lib/types/journal';
import type { DataMap, Map } from '$lib/types/map';
import { Blinding, ConflictOfInterest, type DataPaper, MissingReason, NoteImpact, type Paper, type PaperScores, PaperType, ReviewedPapersBlinding, ReviewedPapersType, ReviewType } from '$lib/types/paper';
import { get_uuid, ratio } from '$lib/utils';


const DIVERSE_INCREASE = 0.4;
const MIN_YEAR = 1950;
const CITATIONS_HALF_SCORE = 50.0;
const REVIEW_TYPE_SCORES = {
	[ReviewType.Review]:			0.0,
	[ReviewType.NarrativeReview]:	0.3,
	[ReviewType.SystematicReview]:	0.8,
	[ReviewType.MetaAnalysis]:		1.0,
};
export const REVIEW_OF_REVIEWS_MULTIPLIER = 5;
export const REVIEW_COUNT_ESTIMATE_RATIO = 0.75;
export const REVIEW_COUNT_SUBPART_RATIO = 0.25;
const REVIEW_COUNT_HALF_SCORE = 30.0;
const TYPE_SCORES = {
	default: {
		[MissingReason.NoAccess]:				0.3,
		[PaperType.Other]:						0.0,
		[PaperType.InVitroStudy]:				0.2,
		[PaperType.CaseReport]:					0.2,
		[PaperType.AnimalStudy]:				0.3,
		[PaperType.EcologicalStudy]:			0.3,
		[PaperType.CrossSectionalStudy]:		0.4,
		[PaperType.CaseControlStudy]:			0.4,
		[PaperType.CohortStudy]:				0.5,
		[PaperType.ClinicalTrial]:				0.5,
		[PaperType.RandomizedControlledTrial]:	1.0,
	},
	no_random: {
		[MissingReason.NoAccess]:				0.4,
		[PaperType.Other]:						0.0,
		[PaperType.InVitroStudy]:				0.2,
		[PaperType.CaseReport]:					0.25,
		[PaperType.AnimalStudy]:				0.3,
		[PaperType.EcologicalStudy]:			0.4,
		[PaperType.CrossSectionalStudy]:		0.6,
		[PaperType.CaseControlStudy]:			0.6,
		[PaperType.CohortStudy]:				0.8,
		[PaperType.ClinicalTrial]:				0.8,
		[PaperType.RandomizedControlledTrial]:	1.0,
	},
	no_causality: {
		[MissingReason.NoAccess]:				0.5,
		[PaperType.Other]:						0.0,
		[PaperType.InVitroStudy]:				0.2,
		[PaperType.CaseReport]:					0.3,
		[PaperType.AnimalStudy]:				0.3,
		[PaperType.EcologicalStudy]:			0.6,
		[PaperType.CrossSectionalStudy]:		0.8,
		[PaperType.CaseControlStudy]:			0.8,
		[PaperType.CohortStudy]:				0.9,
		[PaperType.ClinicalTrial]:				0.9,
		[PaperType.RandomizedControlledTrial]:	1.0,
	},
};
const BLINDING_SCORES = {
	[MissingReason.NoAccess]:	0.3,
	[Blinding.None]:			0.0,
	[Blinding.Single]:			0.5,
	[Blinding.Double]:			1.0,
};
const UNKNOWN_SAMPLE_SIZE_REVIEW_INCREASE = 0.3;
const SAMPLE_SIZE_SCORES = {
	[MissingReason.NoAccess]:		0.25,
	[MissingReason.NotSpecified]:	0.0,
};
const OBSERVATIONAL_SAMPLE_SIZE_HALF_SCORE = 600.0;
const EXPERIMENTAL_SAMPLE_SIZE_HALF_SCORE = 60.0;
const P_VALUE_SCORES = {
	[MissingReason.NoAccess]:		0.25,
	[MissingReason.NotSpecified]:	0.0,
};
const MAX_P_VALUE = 0.05;
const P_VALUE_EXP = 5;
const CONFLICT_OF_INTEREST_SCORES = {
	[MissingReason.NoAccess]:					0.7,
	[ConflictOfInterest.None]:					1.0,
	[ConflictOfInterest.SomeLinks]:				0.5,
	[ConflictOfInterest.YesButOppositeResults]:	0.8,
	[ConflictOfInterest.Yes]:					0.0,
};
const NOTES_SCORES = {
	[NoteImpact.VeryNegative]:	0.0,
	[NoteImpact.Negative]:		0.35,
	[NoteImpact.Neutral]:		0.5,
	[NoteImpact.Positive]:		0.65,
	[NoteImpact.VeryPositive]:	1.0,
};
export const COEFS = {
	year: {
		no_review: { min: 0.9, max: 1.0 },
		review: { min: 0.8, max: 1.0 },
	},
	journal: { min: 0.5, max: 1.1 },
	citations: { min: 0.9, max: 1.1 },
	direct: { min: 0.5, max: 1.0 },
	review: { min: 1.0, max: 2.0 },
	type: {
		effect: { min: 0.4, max: 1.0 },
		no_effect: { min: 0.45, max: 1.0 },
	},
	blinding: {
		effect: { min: 0.7, max: 1.0 },
		no_effect: { min: 0.75, max: 1.0 },
	},
	sample_size: {
		effect: { min: 0.9, max: 1.05 },
		no_effect: { min: 0.7, max: 1.1 },
	},
	p_value: { min: 0.8, max: 1.1 },
	conflict_of_interest: {
		no_narrative_review: { min: 0.5, max: 1.0 },
		narrative_review: { min: 0.4, max: 1.0 },
	},
	notes: { min: 0.5, max: 1.5 },
	publication_bias: { min: 0.9, max: 1.0 },
};


function custom_mean(values: number[], review_count_score: number, no_access: boolean): number
{
	if (values.length === 0)
		return 0.0;

	const mean = values.reduce((acc, val) => acc + val, 0.0) / values.length;
	const max = no_access ? 1.0 : Math.max(...values);

	return mean + (max - mean) * review_count_score * DIVERSE_INCREASE;
}


function apply_coef(value: number, coef: { min: number, max: number }): number
{
	return (value * (coef.max - coef.min)) + coef.min;
}


function score_year(paper: DataPaper): { year_score: number, initial_year_score: number }
{
	const score = ratio(paper.year, MIN_YEAR, new Date().getFullYear());

	return {
		year_score: apply_coef(score, paper.review ? COEFS.year.review : COEFS.year.no_review),
		initial_year_score: score,
	};
}


export function score_journal(paper: DataPaper, journal?: Journal): { journal_score: number, initial_journal_score?: number }
{
	let initial_score: number | undefined = journal?.score ?? 0.0;

	if (paper.journal.retracted)
		initial_score = 0.0;

	let score = apply_coef(initial_score, COEFS.journal);

	if (paper.institution)
	{
		if (!journal)
			initial_score = undefined;

		score = Math.max(score, 1.0);
	}

	return {
		journal_score: score,
		initial_journal_score: initial_score,
	};
}


export function score_citations(paper: DataPaper): { citations_score: number, initial_citations_score: number }
{
	let score = paper.citations;

	score /= CITATIONS_HALF_SCORE;
	score /= score + 1.0

	return {
		citations_score: apply_coef(score, COEFS.citations),
		initial_citations_score: score,
	};
}


export function score_direct(paper: DataPaper): { direct_score: number, initial_direct_score: number }
{
	const score = paper.results.indirect ? 0.0 : 1.0;

	return {
		direct_score: apply_coef(score, COEFS.direct),
		initial_direct_score: score,
	};
}


function score_review(paper: DataPaper): { review_score: number, initial_review_score?: number, review_count_score?: number }
{
	if (!paper.review)
		return { review_score: 1.0 };

	const type_score = paper.review ? REVIEW_TYPE_SCORES[paper.review.type] : 0.0;
	let count_score = paper.review.count !== MissingReason.NoAccess ? paper.review.count : 5;

	count_score *= paper.review.reviews ? REVIEW_OF_REVIEWS_MULTIPLIER : 1.0;
	count_score *= paper.review.estimate ? REVIEW_COUNT_ESTIMATE_RATIO : 1.0;
	count_score *= paper.review.subpart ? REVIEW_COUNT_SUBPART_RATIO : 1.0;
	count_score /= REVIEW_COUNT_HALF_SCORE;
	count_score /= count_score + 1.0;

	const score = type_score * count_score;

	return {
		review_score: apply_coef(score, COEFS.review),
		initial_review_score: score,
		review_count_score: count_score,
	};
}


function score_type(map: DataMap | Map, paper: DataPaper, review_count_score: number): { type_score: number, initial_type_score?: number }
{
	if (map.type.any)
		return { type_score: 1.0 };

	let type_scores = TYPE_SCORES.default;

	if (map.type.no_random)
		type_scores = TYPE_SCORES.no_random;

	else if (map.type.no_causality)
		type_scores = TYPE_SCORES.no_causality;

	let types: (PaperType | MissingReason.NoAccess)[] = [];

	if (paper.type == ReviewedPapersType.DiverseObservationalStudies)
		types = [
			PaperType.CaseReport,
			PaperType.EcologicalStudy,
			PaperType.CrossSectionalStudy,
			PaperType.CaseControlStudy,
			PaperType.CohortStudy,
		];
	else if (paper.type == ReviewedPapersType.DiverseClinicalTrials)
		types = [
			PaperType.ClinicalTrial,
			PaperType.RandomizedControlledTrial,
		];
	else if (paper.type == ReviewedPapersType.DiverseHumanStudies)
		types = [
			PaperType.CaseReport,
			PaperType.EcologicalStudy,
			PaperType.CrossSectionalStudy,
			PaperType.CaseControlStudy,
			PaperType.CohortStudy,
			PaperType.ClinicalTrial,
			PaperType.RandomizedControlledTrial,
		];
	else if (paper.type == ReviewedPapersType.DiverseTypes)
		types = Object.keys(PaperType) as PaperType[];
	else
		types = [paper.type];

	const score = custom_mean(types.map(type => type_scores[type]), review_count_score, paper.type === MissingReason.NoAccess);

	return {
		type_score: apply_coef(score, map.conclusions[paper.results.conclusion].p_value ? COEFS.type.effect : COEFS.type.no_effect),
		initial_type_score: score,
	};
}


function score_blinding(map: DataMap | Map, paper: DataPaper, review_count_score: number): { blinding_score: number, initial_blinding_score?: number }
{
	if (map.no_blinding)
		return { blinding_score: 1.0 };

	let blinding: (Blinding | MissingReason.NoAccess)[] = [];

	if (paper.blinding == ReviewedPapersBlinding.DiverseBlinding)
		blinding = [
			Blinding.None,
			Blinding.Single,
			Blinding.Double,
		];
	else
		blinding = [paper.blinding];

	const score = custom_mean(blinding.map(blind => BLINDING_SCORES[blind]), review_count_score, paper.blinding === MissingReason.NoAccess);

	return {
		blinding_score: apply_coef(score, map.conclusions[paper.results.conclusion].p_value ? COEFS.blinding.effect : COEFS.blinding.no_effect),
		initial_blinding_score: score,
	};
}


function score_sample_size(map: DataMap | Map, paper: DataPaper, review_count_score: number): { sample_size_score: number, initial_sample_size_score?: number }
{
	if (map.no_sample_size || paper.sample_size === MissingReason.NotApplicable || paper.type === PaperType.InVitroStudy)
		return { sample_size_score: 1.0 };

	let score = 0.0;

	if (paper.sample_size === MissingReason.NoAccess || paper.sample_size === MissingReason.NotSpecified)
	{
		if (paper.review)
			score = review_count_score + (1.0 - review_count_score) * UNKNOWN_SAMPLE_SIZE_REVIEW_INCREASE;
		else
			score = SAMPLE_SIZE_SCORES[paper.sample_size];
	}

	else
	{
		let half_score = OBSERVATIONAL_SAMPLE_SIZE_HALF_SCORE;

		if (paper.type === PaperType.AnimalStudy || paper.type === PaperType.ClinicalTrial || paper.type === PaperType.RandomizedControlledTrial)
			half_score = EXPERIMENTAL_SAMPLE_SIZE_HALF_SCORE;

		score = paper.sample_size / half_score;
		score /= score + 1.0;
	}

	return {
		sample_size_score: apply_coef(score, map.conclusions[paper.results.conclusion].p_value ? COEFS.sample_size.effect : COEFS.sample_size.no_effect),
		initial_sample_size_score: score,
	};
}


function score_p_value(map: DataMap | Map, paper: DataPaper): { p_value_score: number, initial_p_value_score?: number }
{
	if (!map.conclusions[paper.results.conclusion].p_value || paper.p_value === MissingReason.NotApplicable)
		return { p_value_score: 1.0 };

	let score = 0.0;

	if (paper.p_value === MissingReason.NoAccess || paper.p_value === MissingReason.NotSpecified)
		score = P_VALUE_SCORES[paper.p_value];

	else
	{
		score = paper.p_value.less_than ? paper.p_value.value / 2.0 : paper.p_value.value;
		score = (1.0 - ratio(score, 0.0, MAX_P_VALUE)) ** P_VALUE_EXP;
	}

	return {
		p_value_score: apply_coef(score, COEFS.p_value),
		initial_p_value_score: score,
	};
}


function score_conflict_of_interest(paper: DataPaper): { conflict_of_interest_score: number, initial_conflict_of_interest_score: number }
{
	const score = CONFLICT_OF_INTEREST_SCORES[paper.conflict_of_interest];
	const is_narrative_review = paper.review && paper.review.type === ReviewType.NarrativeReview;

	return {
		conflict_of_interest_score: apply_coef(score, is_narrative_review ? COEFS.conflict_of_interest.narrative_review : COEFS.conflict_of_interest.no_narrative_review),
		initial_conflict_of_interest_score: score,
	};
}


function score_notes(paper: DataPaper): number
{
	let score = 1.0;

	for (const note of paper.notes)
		score *= apply_coef(NOTES_SCORES[note.impact], COEFS.notes);

	return score;
}


function score_publication_bias(map: DataMap | Map, paper: DataPaper): number
{
	const score = paper.institution || !map.conclusions[paper.results.conclusion].p_value ? 1.0 : 0.0;

	return apply_coef(score, COEFS.publication_bias);
}


function calculate_scores(map: DataMap | Map, paper: DataPaper, journal?: Journal): { scores: PaperScores, score: number }
{
	const { year_score, initial_year_score } = score_year(paper);
	const { journal_score, initial_journal_score } = score_journal(paper, journal);
	const { citations_score, initial_citations_score } = score_citations(paper);
	const { direct_score, initial_direct_score } = score_direct(paper);
	const { review_score, initial_review_score, review_count_score } = score_review(paper);
	const { type_score, initial_type_score } = score_type(map, paper, review_count_score ?? 0.0);
	const { blinding_score, initial_blinding_score } = score_blinding(map, paper, review_count_score ?? 0.0);
	const { sample_size_score, initial_sample_size_score } = score_sample_size(map, paper, review_count_score ?? 0.0);
	const { p_value_score, initial_p_value_score } = score_p_value(map, paper);
	const { conflict_of_interest_score, initial_conflict_of_interest_score } = score_conflict_of_interest(paper);
	const notes_score = score_notes(paper);
	const publication_bias_score = score_publication_bias(map, paper);

	const scores: PaperScores = {
		year: initial_year_score,
		journal: initial_journal_score,
		citations: initial_citations_score,
		direct: initial_direct_score,
		review: initial_review_score,
		review_count: review_count_score,
		type: initial_type_score,
		blinding: initial_blinding_score,
		sample_size: initial_sample_size_score,
		p_value: initial_p_value_score,
		conflict_of_interest: initial_conflict_of_interest_score,
	};

	const score = (
		year_score *
		journal_score *
		citations_score *
		direct_score *
		review_score *
		type_score *
		blinding_score *
		sample_size_score *
		p_value_score *
		conflict_of_interest_score *
		notes_score *
		publication_bias_score
	);

	return { scores, score };
}


export function score_paper(map: DataMap | Map, journal: Journal | undefined, paper: DataPaper, index: number): Paper
{
	const { scores, score } = calculate_scores(map, paper, journal);

	return { index, uuid: get_uuid(), ...paper, scores, score };
}
