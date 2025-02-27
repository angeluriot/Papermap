import type { Journal } from '$lib/types/journal';
import type { DataMap } from '$lib/types/map';
import type { DataPaper, PaperScore, Paper } from '$lib/types/paper';
import { ratio } from '../utils';


const TYPE_SCORES = {
	no_causality: {
		'CaseReport':						0.0,
		'CrossSectionalStudy':				0.8,
		'CohortStudy':						0.9,
		'ClinicalTrial':					0.9,
		'RandomizedControlledTrial':		1.0,
		'BlindedRandomizedControlledTrial':	1.0,
	},
	no_random: {
		'CaseReport':						0.0,
		'CrossSectionalStudy':				0.3,
		'CohortStudy':						0.5,
		'ClinicalTrial':					0.5,
		'RandomizedControlledTrial':		1.0,
		'BlindedRandomizedControlledTrial':	1.0,
	},
	no_blind: {
		'CaseReport':						0.0,
		'CrossSectionalStudy':				0.2,
		'CohortStudy':						0.4,
		'ClinicalTrial':					0.4,
		'RandomizedControlledTrial':		0.9,
		'BlindedRandomizedControlledTrial':	1.0,
	},
	default: {
		'CaseReport':						0.0,
		'CrossSectionalStudy':				0.1,
		'CohortStudy':						0.2,
		'ClinicalTrial':					0.2,
		'RandomizedControlledTrial':		0.6,
		'BlindedRandomizedControlledTrial':	1.0,
	},
}
const REVIEW_TYPE_SCORES = {
	'NarrativeReview':	1.0 / 3.0,
	'SystematicReview':	2.0 / 3.0,
	'MetaAnalysis':		1.0,
}
const REVIEW_COUNT_HALF_SCORE = 50.0;
const ON_SCORES = {
	any_animal: {
		'InVitro':	0.0,
		'Animals':	1.0,
		'Humans':	1.0,
	},
	default: {
		'InVitro':	0.0,
		'Animals':	0.5,
		'Humans':	1.0,
	},
}
const CITATIONS_HALF_SCORE = 100.0;
const MIN_YEAR = 1900;
const SAMPLE_SIZE_HALF_SCORE = 100.0;
const MAX_P_VALUE = 0.05;
const COEFS = {
	journal: 3,
	result: 3,
	type: 10,
	review: 5,
	on: 3,
	citations: 1,
	year: 1,
	sample_size: 1,
	p_value: 1,
	conflict_of_interest: 10,
	retracted: 10,
}


export function score_journal(journal: Journal | undefined): number
{
	if (!journal || !journal.scores.oa)
		return 0.0;

	return journal.scores.oa
}


export function score_result(map: DataMap, paper: DataPaper): number
{
	let previous_consensus = paper.results.consensus ? map.answers[paper.results.consensus] : undefined;
	let result = map.answers[paper.results.conclusion];
	let direct_score = paper.results.indirect ? 0.0 : 1.0;
	let coherence_score = 0.0;

	if (previous_consensus?.neutral)
		previous_consensus = undefined;

	if (previous_consensus && result)
		coherence_score = previous_consensus.group === result.group ? 1.0 : 0.0;

	else if (!previous_consensus && !result)
		coherence_score = 1.0;

	else
		coherence_score = 0.5;

	return (direct_score + coherence_score) / 2.0;
}


function score_type(map: DataMap, paper: DataPaper): number | undefined
{
	if (!paper.type || map.type.any)
		return undefined;

	if (map.type.no_causality)
		return TYPE_SCORES.no_causality[paper.type];

	if (map.type.no_random)
		return TYPE_SCORES.no_random[paper.type];

	if (map.type.no_blind)
		return TYPE_SCORES.no_blind[paper.type];

	return TYPE_SCORES.default[paper.type];
}


function score_review(paper: DataPaper): number
{
	let type_score = paper.review ? REVIEW_TYPE_SCORES[paper.review.type] : 0.0;
	let count_score = paper.review ? paper.review.count : 0;

	count_score /= REVIEW_COUNT_HALF_SCORE;
	count_score /= count_score + 1.0;

	return (type_score + count_score) / 2.0;
}


export function score_on(map: DataMap, paper: DataPaper): number | undefined
{
	if (!paper.on || map.on.any)
		return undefined;

	if (map.on.any_animal)
		return ON_SCORES.any_animal[paper.on];

	return ON_SCORES.default[paper.on];
}


export function score_citations(paper: DataPaper): number
{
	let count_score = paper.citations.critics ? 0.0 : paper.citations.count;

	count_score /= CITATIONS_HALF_SCORE;
	count_score /= count_score + 1.0;

	return count_score;
}


function score_year(paper: DataPaper): number
{
	return ratio(paper.year, MIN_YEAR, new Date().getFullYear());
}


function score_sample_size(map: DataMap, paper: DataPaper): number | undefined
{
	if (!paper.sample_size || map.no_sample_size)
		return undefined;

	let sample_size_score = paper.sample_size / SAMPLE_SIZE_HALF_SCORE;
	sample_size_score /= sample_size_score + 1.0;

	return sample_size_score;
}


function score_p_value(map: DataMap, paper: DataPaper): number | undefined
{
	if (!paper.p_value || map.no_p_value)
		return undefined;

	let p_value_score = paper.p_value.less_than ? paper.p_value.value / 2.0 : paper.p_value.value;
	p_value_score = 1.0 - ratio(p_value_score, 0.0, MAX_P_VALUE);

	return p_value_score;
}


function score_conflict_of_interest(paper: DataPaper): number
{
	return paper.conflict_of_interest ? 0.0 : 1.0;
}


function score_retracted(paper: DataPaper): number
{
	return paper.retracted ? 0.0 : 1.0;
}


function calculate_overall(map: DataMap, score: PaperScore): number
{
	let numerator = 0.0;
	let denominator = 0.0;

	numerator += score.journal * COEFS.journal;
	denominator += COEFS.journal;

	numerator += score.result * COEFS.result;
	denominator += COEFS.result;

	if (!map.type.any)
	{
		numerator += score.type ? score.type * COEFS.type : 0.0;
		denominator += COEFS.type;
	}

	numerator += score.review * COEFS.review;
	denominator += COEFS.review;

	if (!map.on.any)
	{
		numerator += score.on ? score.on * COEFS.on : 0.0;
		denominator += COEFS.on;
	}

	numerator += score.citations * COEFS.citations;
	denominator += COEFS.citations;

	numerator += score.year * COEFS.year;
	denominator += COEFS.year;

	if (!map.no_sample_size)
	{
		numerator += score.sample_size ? score.sample_size * COEFS.sample_size : 0.0;
		denominator += COEFS.sample_size;
	}

	if (!map.no_p_value)
	{
		numerator += score.p_value ? score.p_value * COEFS.p_value : 0.0;
		denominator += COEFS.p_value;
	}

	if (score.conflict_of_interest < 0.5)
	{
		numerator += score.conflict_of_interest * COEFS.conflict_of_interest;
		denominator += COEFS.conflict_of_interest;
	}

	if (score.retracted < 0.5)
	{
		numerator += score.retracted * COEFS.retracted;
		denominator += COEFS.retracted;
	}

	return numerator / denominator;
}


export function score_paper(map: DataMap, journals: Journal | undefined, paper: DataPaper): Paper
{
	let score: PaperScore = {
		journal: score_journal(journals),
		result: score_result(map, paper),
		review: score_review(paper),
		citations: score_citations(paper),
		year: score_year(paper),
		conflict_of_interest: score_conflict_of_interest(paper),
		retracted: score_retracted(paper),
		overall: 0.0,
	};

	let type = score_type(map, paper);
	if (type !== undefined) score.type = type;

	let on = score_on(map, paper);
	if (on !== undefined) score.on = on;

	let sample_size = score_sample_size(map, paper);
	if (sample_size !== undefined) score.sample_size = sample_size;

	let p_value = score_p_value(map, paper);
	if (p_value !== undefined) score.p_value = p_value;

	score.overall = calculate_overall(map, score);

	return { ...paper, score };
}
