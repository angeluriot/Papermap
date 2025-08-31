import type { Journal } from './journal';


export enum MissingReason
{
	NoAccess = 'NoAccess',
	NotSpecified = 'NotSpecified',
	NotApplicable = 'NotApplicable',
}


export enum JournalMissingReason
{
	NotFound = 'NotFound',
	NotPublished = 'NotPublished',
}


export enum StudyOn
{
	InVitro = 'InVitro',
	Animals = 'Animals',
	Humans = 'Humans',
}


export enum ReviewedPapersType
{
	DiverseObservationalStudies = 'DiverseObservationalStudies',
	DiverseClinicalTrials = 'DiverseClinicalTrials',
	DiverseTypes = 'DiverseTypes',
}


export enum ReviewedStudiesOn
{
	DiverseSubjects = 'DiverseSubjects',
}


export enum PaperType
{
	CaseReport = 'CaseReport',
	EcologicalStudy = 'EcologicalStudy',
	CrossSectionalStudy = 'CrossSectionalStudy',
	CaseControlStudy = 'CaseControlStudy',
	CohortStudy = 'CohortStudy',
	ClinicalTrial = 'ClinicalTrial',
	RandomizedControlledTrial = 'RandomizedControlledTrial',
	BlindedRandomizedControlledTrial = 'BlindedRandomizedControlledTrial',
}


export enum ReviewType
{
	Review = 'Review',
	NarrativeReview = 'NarrativeReview',
	SystematicReview = 'SystematicReview',
	MetaAnalysis = 'MetaAnalysis',
}


export enum ConflictOfInterest
{
	None = 'None',
	SomeLinks = 'SomeLinks',
	YesButOppositeResults = 'YesButOppositeResults',
	Yes = 'Yes',
}


export enum NoteImpact
{
	VeryNegative = 'VeryNegative',
	Negative = 'Negative',
	Neutral = 'Neutral',
	Positive = 'Positive',
	VeryPositive = 'VeryPositive',
}


export enum Edit
{
	Added = 'Added',
	Edited = 'Edited',
	Deleted = 'Deleted',
}


export interface DataPaper
{
	id?: string;
	title: string;
	override_seed?: number;
	institution?: {
		name: string;
		acronym: string;
	};
	authors: string[];
	year: number;
	link: string;
	journal: {
		id: string | JournalMissingReason,
		retracted: boolean,
	};
	citations: number | MissingReason.NotSpecified;
	results: {
		consensus: string | MissingReason.NotSpecified | MissingReason.NoAccess,
		conclusion: string,
		indirect: boolean,
	};
	quote: string;
	review?: {
		type: ReviewType,
		reviews: boolean,
		estimate: boolean,
		count: number | MissingReason.NoAccess,
		subpart: boolean,
	};
	type: PaperType | ReviewedPapersType | MissingReason;
	on: StudyOn | ReviewedStudiesOn | MissingReason;
	sample_size: number | MissingReason;
	p_value: {
		value: number,
		less_than: boolean,
	} | MissingReason;
	conflict_of_interest: ConflictOfInterest | MissingReason.NoAccess;
	notes: {
		title: string,
		description: string,
		link?: string,
		impact: NoteImpact,
	}[];
}


export interface PaperScores
{
	citations: number;
	review_count: number;
	type: number;
	on: number;
	sample_size: number;
	p_value: number;
}


export interface Paper extends DataPaper
{
	index: number;
	uuid: string;
	scores: PaperScores;
	score: number;
	edit?: Edit;
}


export interface SearchPaperResult
{
	id?: string;
	link?: string;
	title?: string;
	year?: number;
	journal?: Journal;
	authors?: string[];
	citations?: number;
	retracted?: boolean;
}


export function paper_to_datapaper(paper: Paper): DataPaper
{
	const { index, uuid, scores, score, edit, ...data } = paper;
	return data;
}


export function no_access(paper: Paper | DataPaper)
{
	return (
		paper.results.consensus === MissingReason.NoAccess ||
		(paper.review && paper.review.count === MissingReason.NoAccess) ||
		paper.type === MissingReason.NoAccess ||
		paper.on === MissingReason.NoAccess ||
		paper.sample_size === MissingReason.NoAccess ||
		paper.p_value === MissingReason.NoAccess ||
		paper.conflict_of_interest === MissingReason.NoAccess
	);
}
