enum JournalType
{
	Journal = 'Journal',
	BookSeries = 'Book Series',
}

export interface Journal
{
	id: string;
	title: string;
	link?: string;
	type: JournalType;
	publisher?: string;
	scopes: string[];
	metrics: {
		h?: number,
		if?: number,
		cs?: number,
		sjr?: number,
		snip?: number,
		ef?: number,
		ai?: number,
		self?: number,
		rti?: number,
		top?: number,
		alt?: number,
	};
	scores: {
		oa?: number,
		h?: number,
		if?: number,
		cs?: number,
		sjr?: number,
		snip?: number,
		ef?: number,
		ai?: number,
		self?: number,
		rti?: number,
		top?: number,
		alt?: number,
	};
}

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

export interface Paper
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
		conclusion?: string,
		indirect: boolean,
	};
	citations: {
		count: number,
		critics: boolean,
	};
	type?: PaperType;
	review?: {
		type: ReviewType,
		count: number,
	};
	on?: StudyOn;
	sample_size?: number;
	p_value?: {
		value: number,
		less_than: boolean,
	};
	conflict_of_interest: boolean;
}

export interface Map
{
	id: string;
	question: string;
	detailed_question: string;
	possible_types: PaperType[];
	about: StudyOn;
	has_sample_size: boolean;
	has_p_value: boolean;
	papers: Paper[];
}
