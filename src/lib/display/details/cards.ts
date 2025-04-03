import { Color, COLORS } from '$lib/colors';
import { StudyOn, PaperType, ReviewType } from '$lib/types/paper';


export const TO_EMOJI = {
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


export const TO_TEXT = {
	[StudyOn.InVitro]: 'In Vitro',
	[StudyOn.Animals]: 'Animals',
	[StudyOn.Humans]: 'Humans',
	[PaperType.CaseReport]: 'Case Report',
	[PaperType.CrossSectionalStudy]: 'Cross-Sectional Study',
	[PaperType.CohortStudy]: 'Cohort Study',
	[PaperType.ClinicalTrial]: 'Clinical Trial',
	[PaperType.RandomizedControlledTrial]: 'Randomized Controlled Trial',
	[PaperType.BlindedRandomizedControlledTrial]: 'Blinded Randomized Controlled Trial',
	[ReviewType.NarrativeReview]: 'Narrative Review',
	[ReviewType.SystematicReview]: 'Systematic Review',
	[ReviewType.MetaAnalysis]: 'Meta-Analysis',
}


export const TO_TEXT_PLURAL = {
	[PaperType.CaseReport]: 'Case Reports',
	[PaperType.CrossSectionalStudy]: 'Cross-Sectional Studies',
	[PaperType.CohortStudy]: 'Cohort Studies',
	[PaperType.ClinicalTrial]: 'Clinical Trials',
	[PaperType.RandomizedControlledTrial]: 'Randomized Controlled Trials',
	[PaperType.BlindedRandomizedControlledTrial]: 'Blinded Randomized Controlled Trials',
}


export const REVIEW_COLORS = {
	[ReviewType.NarrativeReview]: '#48c7e5',
	[ReviewType.SystematicReview]: '#5d97ed',
	[ReviewType.MetaAnalysis]: '#5d75ed',
}


export const TO_DESCRIPTION = {
	[StudyOn.InVitro]: 'An experiment conducted in a controlled environment outside of a living organism',
	[StudyOn.Animals]: 'An experiment conducted on non‑human living organisms (often mice or rats)',
	[StudyOn.Humans]: 'An experiment conducted on human subjects',
	[PaperType.CaseReport]: 'A report describing observations from a unique clinical case',
	[PaperType.CrossSectionalStudy]: 'An analysis of population data at a given point in time',
	[PaperType.CohortStudy]: 'A study that follows a group of individuals over time to observe outcomes',
	[PaperType.ClinicalTrial]: 'An experiment assessing the effects of an intervention under controlled conditions',
	[PaperType.RandomizedControlledTrial]: 'A clinical trial where participants are randomly assigned to a control or an experimental group for a fair comparison',
	[PaperType.BlindedRandomizedControlledTrial]: 'A randomized controlled trial where participants and/or researchers are unaware of group assignments to reduce bias',
	[ReviewType.NarrativeReview]: 'A qualitative summary of the existing literature on a particular topic',
	[ReviewType.SystematicReview]: 'A comprehensive review of existing literature using a structured methodology to minimize bias',
	[ReviewType.MetaAnalysis]: 'A statistical analysis that combines the results of multiple scientific studies',
}


export function score_to_color(score: number | undefined): string
{
	if (score === undefined) return	COLORS[Color.Gray].default;
	if (score < 0.1) return			'#ea3f60';
	if (score < 0.2) return			'#ee6a4b';
	if (score < 0.3) return			'#ef8a37';
	if (score < 0.4) return			'#eaa732';
	if (score < 0.5) return			'#edc726';
	if (score < 0.6) return			'#d6d622';
	if (score < 0.7) return			'#bfd82a';
	if (score < 0.8) return			'#a6d32d';
	if (score < 0.9) return			'#82d150';
	return							'#24c68c';
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
