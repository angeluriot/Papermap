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


export interface DataPaper
{
	id?: string;
	title: string;
	authors: string[];
	journal: {
		status: JournalStatus,
		id?: string,
	};
	year: number;
	link?: string;
	results: {
		consensus?: string,
		conclusion: string,
		indirect: boolean,
	};
	quote: string;
	type?: PaperType;
	review?: {
		type: ReviewType,
		count: number,
	};
	on?: StudyOn;
	citations: {
		count: number,
		critics: boolean,
	};
	sample_size?: number;
	p_value?: {
		value: number,
		less_than: boolean,
	};
	conflict_of_interest: boolean;
	retracted: boolean;
}


export interface PaperScore
{
	journal: number;
	result: number;
	type?: number;
	review: number;
	on?: number;
	citations: number;
	year: number;
	sample_size?: number;
	p_value?: number;
	conflict_of_interest: number;
	retracted: number;
	overall: number;
}


export interface Paper extends DataPaper
{
	score: PaperScore;
}


export function paper_to_datapaper(paper: Paper): DataPaper
{
	const { score, ...data } = paper;
	return data;
}
