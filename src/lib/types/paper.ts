import type { Journal } from './journal';


export enum JournalStatus
{
	Found = 'Found',
	NotFound = 'NotFound',
	NotPublished = 'NotPublished',
}


export enum StudyOn
{
	InVitro = 'InVitro',
	Animals = 'Animals',
	Humans = 'Humans',
}


export enum PaperType
{
	CaseReport = 'CaseReport',
	CrossSectionalStudy = 'CrossSectionalStudy',
	CohortStudy = 'CohortStudy',
	ClinicalTrial = 'ClinicalTrial',
	RandomizedControlledTrial = 'RandomizedControlledTrial',
	BlindedRandomizedControlledTrial = 'BlindedRandomizedControlledTrial',
}


export enum ReviewType
{
	NarrativeReview = 'NarrativeReview',
	SystematicReview = 'SystematicReview',
	MetaAnalysis = 'MetaAnalysis',
}


export enum NoteImpact
{
	ExtremelyNegative = 'ExtremelyNegative',
	Negative = 'Negative',
	Positive = 'Positive',
	ExtremelyPositive = 'ExtremelyPositive',
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
	authors: string[];
	year: number;
	link: string;
	journal: {
		status: JournalStatus,
		id?: string,
		retracted: boolean,
	};
	citations: {
		count: number,
		critics: boolean,
	};
	results: {
		consensus: string,
		conclusion: string,
		indirect: boolean,
	};
	quote: string;
	review?: {
		type: ReviewType,
		count: number,
	};
	type?: PaperType;
	on?: StudyOn;
	sample_size?: number;
	p_value?: {
		value: number,
		less_than: boolean,
	};
	conflict_of_interest: boolean;
	notes: {
		title: string,
		description: string,
		impact: NoteImpact,
	}[];
}


export interface PaperScores
{
	citations_count: number;
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
