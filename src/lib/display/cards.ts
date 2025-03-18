import { StudyOn, PaperType, ReviewType } from '$lib/types/paper';


export const EMOJIS = {
	[StudyOn.InVitro]: '🧫',
	[StudyOn.Animals]: '🐭',
	[StudyOn.Humans]: '🙋',
	[PaperType.CaseReport]: '🔍',
	[PaperType.CrossSectionalStudy]: '📸',
	[PaperType.CohortStudy]: '⏳',
	[PaperType.ClinicalTrial]: '🎛️',
	[PaperType.RandomizedControlledTrial]: '🎲',
	[PaperType.BlindedRandomizedControlledTrial]: '🫣',
	[ReviewType.NarrativeReview]: '📖',
	[ReviewType.SystematicReview]: '🗂️',
	[ReviewType.MetaAnalysis]: '📊',
}


export function type_to_plural(type: PaperType): string
{
	if (type === PaperType.CaseReport)
		return 'Case Reports';

	if (type === PaperType.CrossSectionalStudy)
		return 'Cross-Sectional Studies';

	if (type === PaperType.CohortStudy)
		return 'Cohort Studies';

	if (type === PaperType.ClinicalTrial)
		return 'Clinical Trials';

	if (type === PaperType.RandomizedControlledTrial)
		return 'Randomized Controlled Trials';

	if (type === PaperType.BlindedRandomizedControlledTrial)
		return 'Blinded Randomized Controlled Trials';

	return 'Unknown';
}


export function score_to_emoji(score: number | undefined): string
{
	if (score === undefined) return	'🤷';
	if (score < 0.1) return			'💩';
	if (score < 0.2) return			'🤮';
	if (score < 0.3) return			'😨';
	if (score < 0.4) return			'☹️';
	if (score < 0.5) return			'🫤';
	if (score < 0.6) return			'😐';
	if (score < 0.7) return			'🙂';
	if (score < 0.8) return			'😊';
	if (score < 0.9) return			'🥰';
	return							'🤩';
}


export function review_count_score_to_emoji(score: number | undefined): string
{
	if (score === undefined) return	'🤷';
	if (score < 0.2) return			'📃';
	if (score < 0.4) return			'📑';
	if (score < 0.6) return			'🗂️';
	if (score < 0.8) return			'📖';
	return							'📚';
}


export function citation_score_to_emoji(score: number | undefined): string
{
	if (score === undefined) return	'🤷';
	if (score < 0.2) return			'🫥';
	if (score < 0.4) return			'🫣';
	if (score < 0.6) return			'🤗';
	if (score < 0.8) return			'😎';
	return							'🤩';
}


export function sample_size_score_to_emoji(score: number | undefined): string
{
	if (score === undefined) return	'🤷';
	if (score < 0.25) return		'🧍';
	if (score < 0.5) return			'🧑‍🤝‍🧑';
	if (score < 0.75) return		'👪';
	return							'🧑‍🧑‍🧒‍🧒';
}


export function p_value_score_to_emoji(score: number | undefined): string
{
	if (score === undefined) return	'🤷';
	if (score < 0.25) return		'🎲';
	if (score < 0.5) return			'👀';
	if (score < 0.75) return		'🔍';
	return							'🔬';
}
