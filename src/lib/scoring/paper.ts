import type { Journal } from '$lib/types/journal';
import type { DataMap, Map } from '$lib/types/map';
import { type DataPaper, type PaperScores, type Paper, PaperType, NoteImpact, ReviewType, StudyOn, MissingReason, ConflictOfInterest, ReviewedPapersType, ReviewedStudiesOn } from '$lib/types/paper';
import { get_uuid, ratio } from '$lib/utils';


const TYPE_SCORES = {
	default: {
		[MissingReason.NoAccess]:						0.2,
		[MissingReason.NotSpecified]:					0.0,
		[MissingReason.NotApplicable]:					0.0,
		[PaperType.CaseReport]:							0.0,
		[PaperType.EcologicalStudy]:					0.2,
		[PaperType.CrossSectionalStudy]:				0.25,
		[PaperType.CaseControlStudy]:					0.25,
		[PaperType.CohortStudy]:						0.3,
		[PaperType.ClinicalTrial]:						0.3,
		[PaperType.RandomizedControlledTrial]:			0.7,
		[PaperType.BlindedRandomizedControlledTrial]:	1.0,
	},
	no_blind: {
		[MissingReason.NoAccess]:						0.3,
		[MissingReason.NotSpecified]:					0.0,
		[MissingReason.NotApplicable]:					0.0,
		[PaperType.CaseReport]:							0.0,
		[PaperType.EcologicalStudy]:					0.3,
		[PaperType.CrossSectionalStudy]:				0.35,
		[PaperType.CaseControlStudy]:					0.35,
		[PaperType.CohortStudy]:						0.4,
		[PaperType.ClinicalTrial]:						0.4,
		[PaperType.RandomizedControlledTrial]:			1.0,
		[PaperType.BlindedRandomizedControlledTrial]:	1.0,
	},
	no_random: {
		[MissingReason.NoAccess]:						0.3,
		[MissingReason.NotSpecified]:					0.0,
		[MissingReason.NotApplicable]:					0.0,
		[PaperType.CaseReport]:							0.0,
		[PaperType.EcologicalStudy]:					0.3,
		[PaperType.CrossSectionalStudy]:				0.4,
		[PaperType.CaseControlStudy]:					0.4,
		[PaperType.CohortStudy]:						0.5,
		[PaperType.ClinicalTrial]:						0.5,
		[PaperType.RandomizedControlledTrial]:			1.0,
		[PaperType.BlindedRandomizedControlledTrial]:	1.0,
	},
	no_causality: {
		[MissingReason.NoAccess]:						0.6,
		[MissingReason.NotSpecified]:					0.0,
		[MissingReason.NotApplicable]:					0.0,
		[PaperType.CaseReport]:							0.0,
		[PaperType.EcologicalStudy]:					0.6,
		[PaperType.CrossSectionalStudy]:				0.7,
		[PaperType.CaseControlStudy]:					0.7,
		[PaperType.CohortStudy]:						0.8,
		[PaperType.ClinicalTrial]:						0.8,
		[PaperType.RandomizedControlledTrial]:			1.0,
		[PaperType.BlindedRandomizedControlledTrial]:	1.0,
	},
}
const REVIEW_TYPE_SCORES = {
	[ReviewType.NarrativeReview]:	0.5,
	[ReviewType.SystematicReview]:	1.5,
	[ReviewType.MetaAnalysis]:		2.0,
}
const REVIEW_COUNT_HALF_SCORE = 30.0;
const ON_SCORES = {
	any_animal: {
		[MissingReason.NoAccess]:				0.6,
		[MissingReason.NotSpecified]:			0.0,
		[MissingReason.NotApplicable]:			0.0,
		[StudyOn.InVitro]:						0.0,
		[StudyOn.Animals]:						1.0,
		[StudyOn.Humans]:						1.0,
	},
	default: {
		[MissingReason.NoAccess]:				0.3,
		[MissingReason.NotSpecified]:			0.0,
		[MissingReason.NotApplicable]:			0.0,
		[StudyOn.InVitro]:						0.0,
		[StudyOn.Animals]:						0.3,
		[StudyOn.Humans]:						1.0,
	},
}
const CITATIONS_HALF_SCORE = 50.0;
const MIN_YEAR = 1900;
const SAMPLE_SIZE_HALF_SCORE = 300.0;
const RCT_SAMPLE_SIZE_HALF_SCORE = 50.0;
const MAX_P_VALUE = 0.05;
const P_VALUE_EXP = 2;
const NO_P_VALUE_TYPE_INCREASE = 0.3;
export const REVIEW_OF_REVIEWS_MULTIPLIER = 5;
const COEFS = {
	year: 0.1,
	journal: 0.5,
	citations: 0.1,
	critics: 0.5,
	coherence: 0.1,
	direct: 0.5,
	review: 0.5,
	type: 0.7,
	on: 0.5,
	sample_size: 0.2,
	p_value: 0.1,
	conflict_of_interest: 0.6,
	notes: 0.5,
	publication_bias: 0.1,
}


function score_year(paper: DataPaper): number
{
	return ratio(paper.year, MIN_YEAR, new Date().getFullYear());
}


export function score_journal(paper: DataPaper, journal: Journal | undefined): number
{
	if (!journal?.score || paper.journal.retracted)
		return 0.0;

	return journal.score;
}


export function score_citations(paper: DataPaper): number
{
	if (paper.citations.count === MissingReason.NotSpecified)
		return 0.1;

	let score = paper.citations.count;

	score /= CITATIONS_HALF_SCORE;
	score /= score + 1.0;

	return score;
}


export function score_critics(paper: DataPaper): number
{
	return paper.citations.critics ? 0.0 : 1.0;
}


export function score_coherence(map: DataMap | Map, paper: DataPaper): number
{
	if (paper.results.consensus === MissingReason.NotSpecified || paper.results.consensus === MissingReason.NoAccess)
		return 0.5;

	return map.consensus[paper.results.consensus].coherence[paper.results.conclusion];
}


export function score_direct(paper: DataPaper): number
{
	return paper.results.indirect ? 0.0 : 1.0;
}


function score_review_type(paper: DataPaper): number
{
	return paper.review ? REVIEW_TYPE_SCORES[paper.review.type] : 0.0;
}


function score_review_count(paper: DataPaper): number
{
	if (!paper.review)
		return 0.0;

	if (paper.review.count === MissingReason.NoAccess)
		return paper.review.reviews ? 0.5 : 0.25;

	if (paper.review.count === MissingReason.NotSpecified)
		return paper.review.reviews ? 0.2 : 0.1;

	let score = paper.review.count * (paper.review.reviews ? REVIEW_OF_REVIEWS_MULTIPLIER : 1);

	score /= REVIEW_COUNT_HALF_SCORE;
	score /= score + 1.0;

	return score;
}


function score_type(map: DataMap | Map, paper: DataPaper): number
{
	if (map.type.any)
		return 1.0;

	let type_scores = TYPE_SCORES.default;

	if (map.type.no_causality)
		type_scores = TYPE_SCORES.no_causality;

	else if (map.type.no_random)
		type_scores = TYPE_SCORES.no_random;

	else if (map.type.no_blind)
		type_scores = TYPE_SCORES.no_blind;

	let types: (PaperType | MissingReason)[] = [];

	if (paper.type == ReviewedPapersType.DiverseObservationalStudies)
		types = [PaperType.CaseReport, PaperType.EcologicalStudy, PaperType.CrossSectionalStudy, PaperType.CaseControlStudy, PaperType.CohortStudy];
	else if (paper.type == ReviewedPapersType.DiverseClinicalTrials)
		types = [PaperType.ClinicalTrial, PaperType.RandomizedControlledTrial, PaperType.BlindedRandomizedControlledTrial];
	else if (paper.type == ReviewedPapersType.DiverseTypes)
		types = Object.keys(PaperType) as PaperType[];
	else
		types = [paper.type];

	let score = types.map(type => type_scores[type]).reduce((acc, score) => acc + score, 0.0) / types.length;

	if (!map.conclusions[paper.results.conclusion].p_value)
		score += (1.0 - score) * NO_P_VALUE_TYPE_INCREASE;

	return score;
}


export function score_on(map: DataMap | Map, paper: DataPaper): number
{
	if (map.on.any)
		return 1.0;

	let on_scores = ON_SCORES.default;

	if (map.on.any_animal)
		on_scores = ON_SCORES.any_animal;

	let ons: (StudyOn | MissingReason)[] = [];

	if (paper.on == ReviewedStudiesOn.DiverseSubjects)
		ons = Object.keys(StudyOn) as StudyOn[];
	else
		ons = [paper.on];

	return ons.map(subject => on_scores[subject]).reduce((acc, score) => acc + score, 0.0) / ons.length;
}


function score_sample_size(map: DataMap | Map, paper: DataPaper, review_count_score: number): number
{
	if (map.no_sample_size || paper.sample_size === MissingReason.NotApplicable)
		return 1.0;

	if (paper.review && (paper.sample_size === MissingReason.NoAccess || paper.sample_size === MissingReason.NotSpecified))
		return review_count_score;

	if (paper.sample_size === MissingReason.NoAccess)
		return 0.25;

	if (paper.sample_size === MissingReason.NotSpecified)
		return 0.0;

	let half_score = SAMPLE_SIZE_HALF_SCORE;

	if (paper.type === PaperType.RandomizedControlledTrial || paper.type === PaperType.BlindedRandomizedControlledTrial)
		half_score = RCT_SAMPLE_SIZE_HALF_SCORE;

	let score = paper.sample_size / half_score;
	score /= score + 1.0;

	return score;
}


function score_p_value(map: DataMap | Map, paper: DataPaper): number
{
	if (!map.conclusions[paper.results.conclusion].p_value || paper.p_value === MissingReason.NotApplicable)
		return 1.0;

	if (paper.p_value === MissingReason.NoAccess)
		return 0.25;

	if (paper.p_value === MissingReason.NotSpecified)
		return 0.0;

	let p_value_score = paper.p_value.less_than ? paper.p_value.value / 2.0 : paper.p_value.value;
	p_value_score = (1.0 - ratio(p_value_score, 0.0, MAX_P_VALUE)) ** P_VALUE_EXP;

	return p_value_score;
}


function score_conflict_of_interest(paper: DataPaper): number
{
	switch (paper.conflict_of_interest)
	{
		case MissingReason.NoAccess:
			return 0.6;
		case ConflictOfInterest.None:
			return 1.0;
		case ConflictOfInterest.SomeLinks:
			return 0.5;
		case ConflictOfInterest.YesButOppositeResults:
			return 0.8;
		case ConflictOfInterest.Yes:
			return 0.0;
	}
}


function score_notes(paper: DataPaper): number[]
{
	let scores: number[] = [];

	for (const note of paper.notes)
	{
		if (note.impact === NoteImpact.ExtremelyNegative)
			scores.push(0.0);
		else if (note.impact === NoteImpact.VeryNegative)
			scores.push(0.5);
		else if (note.impact === NoteImpact.Negative)
			scores.push(0.8);
		else if (note.impact === NoteImpact.Positive)
			scores.push(1.2);
		else if (note.impact === NoteImpact.VeryPositive)
			scores.push(1.5);
		else if (note.impact === NoteImpact.ExtremelyPositive)
			scores.push(2.0);
	}

	return scores;
}


function score_publication_bias(map: DataMap | Map, paper: DataPaper): number
{
	return map.conclusions[paper.results.conclusion].p_value ? 0.0 : 1.0;
}


function calculate_scores(map: DataMap | Map, paper: DataPaper, journal: Journal | undefined): { scores: PaperScores, score: number }
{
	let year_score = score_year(paper);
	let journal_score = score_journal(paper, journal);
	let citations_score = score_citations(paper);
	let critics_score = score_critics(paper);
	let coherence_score = score_coherence(map, paper);
	let direct_score = score_direct(paper);
	let review_type_score = score_review_type(paper);
	let review_count_score = score_review_count(paper);
	let type_score = score_type(map, paper);
	let on_score = score_on(map, paper);
	let sample_size_score = score_sample_size(map, paper, review_count_score);
	let p_value_score = score_p_value(map, paper);
	let conflict_of_interest_score = score_conflict_of_interest(paper);
	let notes_scores = score_notes(paper);
	let publication_bias_score = score_publication_bias(map, paper);

	let scores: PaperScores = {
		citations_count: citations_score,
		review_count: review_count_score,
		type: type_score,
		on: on_score,
		sample_size: sample_size_score,
		p_value: p_value_score,
	};

	year_score = (year_score * COEFS.year) + (1 - COEFS.year);
	journal_score = (journal_score * COEFS.journal) + (1 - COEFS.journal);

	if (critics_score > 0.5)
		citations_score = 0.0;

	citations_score = (citations_score * COEFS.citations) + (1 - COEFS.citations);
	critics_score = (critics_score * COEFS.critics) + (1 - COEFS.critics);
	coherence_score = (coherence_score * COEFS.coherence) + (1 - COEFS.coherence);
	direct_score = (direct_score * COEFS.direct) + (1 - COEFS.direct);

	let review_score = 1 + review_type_score * review_count_score;
	review_score = (review_score * COEFS.review) + (1 - COEFS.review);
	type_score = (type_score * COEFS.type) + (1 - COEFS.type);
	on_score = (on_score * COEFS.on) + (1 - COEFS.on);
	sample_size_score = (sample_size_score * COEFS.sample_size) + (1 - COEFS.sample_size);
	p_value_score = (p_value_score * COEFS.p_value) + (1 - COEFS.p_value);
	conflict_of_interest_score = (conflict_of_interest_score * COEFS.conflict_of_interest) + (1 - COEFS.conflict_of_interest);
	notes_scores = notes_scores.map(score => (score * COEFS.notes) + (1 - COEFS.notes));
	publication_bias_score = (publication_bias_score * COEFS.publication_bias) + (1 - COEFS.publication_bias);

	const score = (
		year_score *
		journal_score *
		citations_score *
		critics_score *
		coherence_score *
		direct_score *
		review_score *
		type_score *
		on_score *
		sample_size_score *
		p_value_score *
		conflict_of_interest_score *
		notes_scores.reduce((acc, score) => acc * score, 1) *
		publication_bias_score
	);

	return { scores, score };
}


export function score_paper(map: DataMap | Map, journal: Journal | undefined, paper: DataPaper, index: number): Paper
{
	const { scores, score } = calculate_scores(map, paper, journal);

	return { index, uuid: get_uuid(), ...paper, scores, score };
}
