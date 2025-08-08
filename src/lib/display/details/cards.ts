import { Color, COLORS } from '$lib/colors';
import { StudyOn, PaperType, ReviewType, NoteImpact, MissingReason, ReviewedPapersType, ReviewedStudiesOn, ConflictOfInterest } from '$lib/types/paper';
import * as ColorLib from 'color';


export const TO_EMOJI = {
	[StudyOn.InVitro]: '🧫',
	[StudyOn.Animals]: '🐭',
	[StudyOn.Humans]: '🙋',
	[PaperType.CaseReport]: '🔍',
	[PaperType.EcologicalStudy]: '🌍',
	[PaperType.CrossSectionalStudy]: '📸',
	[PaperType.CaseControlStudy]: '👥',
	[PaperType.CohortStudy]: '⏳',
	[PaperType.ClinicalTrial]: '🎛️',
	[PaperType.RandomizedControlledTrial]: '🎲',
	[PaperType.BlindedRandomizedControlledTrial]: '🫣',
	[ReviewedPapersType.DiverseObservationalStudies]: '👀',
	[ReviewedPapersType.DiverseClinicalTrials]: '🧪',
	[ReviewType.Review]: '🔍',
	[ReviewType.NarrativeReview]: '📖',
	[ReviewType.SystematicReview]: '🗂️',
	[ReviewType.MetaAnalysis]: '📊',
	[ConflictOfInterest.None]: '😇',
	[ConflictOfInterest.SomeLinks]: '🧐',
	[ConflictOfInterest.YesButOppositeResults]: '↩️',
	[ConflictOfInterest.Yes]: '🤑',
}


export const TO_TEXT = {
	[StudyOn.InVitro]: 'In Vitro',
	[StudyOn.Animals]: 'Animals',
	[StudyOn.Humans]: 'Humans',
	[ReviewedStudiesOn.DiverseSubjects]: 'Diverse Subjects',
	[PaperType.CaseReport]: 'Case Report',
	[PaperType.EcologicalStudy]: 'Ecological Study',
	[PaperType.CrossSectionalStudy]: 'Cross-Sectional Study',
	[PaperType.CaseControlStudy]: 'Case-Control Study',
	[PaperType.CohortStudy]: 'Cohort Study',
	[PaperType.ClinicalTrial]: 'Clinical Trial',
	[PaperType.RandomizedControlledTrial]: 'Randomized Controlled Trial',
	[PaperType.BlindedRandomizedControlledTrial]: 'Blinded Randomized Controlled Trial',
	[ReviewedPapersType.DiverseObservationalStudies]: 'Diverse Observational Studies',
	[ReviewedPapersType.DiverseClinicalTrials]: 'Diverse Clinical Trials',
	[ReviewedPapersType.DiverseTypes]: 'Diverse Types',
	[ReviewType.Review]: 'Review',
	[ReviewType.NarrativeReview]: 'Narrative Review',
	[ReviewType.SystematicReview]: 'Systematic Review',
	[ReviewType.MetaAnalysis]: 'Meta-Analysis',
	[MissingReason.NoAccess]: 'No Access',
	[MissingReason.NotSpecified]: 'Not Specified',
	[MissingReason.NotApplicable]: 'Not Applicable',
	[ConflictOfInterest.None]: 'None',
	[ConflictOfInterest.SomeLinks]: 'Some links',
	[ConflictOfInterest.YesButOppositeResults]: 'Yes but opposite results',
	[ConflictOfInterest.Yes]: 'Yes',
}


export const TO_TEXT_PLURAL = {
	[PaperType.CaseReport]: 'Case Reports',
	[PaperType.EcologicalStudy]: 'Ecological Studies',
	[PaperType.CrossSectionalStudy]: 'Cross-Sectional Studies',
	[PaperType.CaseControlStudy]: 'Case-Control Studies',
	[PaperType.CohortStudy]: 'Cohort Studies',
	[PaperType.ClinicalTrial]: 'Clinical Trials',
	[PaperType.RandomizedControlledTrial]: 'Randomized Controlled Trials',
	[PaperType.BlindedRandomizedControlledTrial]: 'Blinded Randomized Controlled Trials',
	[ReviewedPapersType.DiverseObservationalStudies]: 'Diverse Observational Studies',
	[ReviewedPapersType.DiverseClinicalTrials]: 'Diverse Clinical Trials',
	[ReviewedPapersType.DiverseTypes]: 'Diverse Types',
}


export const REVIEW_COLORS = {
	[ReviewType.Review]: '#48c7e5',
	[ReviewType.NarrativeReview]: '#48c7e5',
	[ReviewType.SystematicReview]: '#5d97ed',
	[ReviewType.MetaAnalysis]: '#5d75ed',
}


export const TO_DESCRIPTION = {
	[StudyOn.InVitro]: 'An experiment conducted in a controlled environment outside of a living organism',
	[StudyOn.Animals]: 'An experiment conducted on non‑human living organisms (often mice or rats)',
	[StudyOn.Humans]: 'An experiment conducted on human subjects',
	[PaperType.CaseReport]: 'A report describing observations from a single patient or a small group of patients',
	[PaperType.EcologicalStudy]: 'An analysis of data collected from populations or groups rather than individuals',
	[PaperType.CrossSectionalStudy]: 'An analysis of population data at a given point in time',
	[PaperType.CaseControlStudy]: 'A observational study comparing individuals with a condition to those without it',
	[PaperType.CohortStudy]: 'A study that follows a group of individuals over time to observe outcomes',
	[PaperType.ClinicalTrial]: 'An experiment assessing the effects of an intervention under controlled conditions',
	[PaperType.RandomizedControlledTrial]: 'A clinical trial where participants are randomly assigned to a control or an experimental group for a fair comparison',
	[PaperType.BlindedRandomizedControlledTrial]: 'A randomized controlled trial where participants and/or researchers are unaware of group assignments to reduce bias',
	[ReviewedPapersType.DiverseObservationalStudies]: 'Diverse observational studies (case reports, ecological studies, cross-sectional studies, case-control studies or cohort studies)',
	[ReviewedPapersType.DiverseClinicalTrials]: 'Diverse clinical trials with or without randomization or blinding',
	[ReviewType.Review]: 'A reanalysis or commentary on existing literature',
	[ReviewType.NarrativeReview]: 'A qualitative summary of the existing literature on a particular topic',
	[ReviewType.SystematicReview]: 'A comprehensive review of existing literature using a structured methodology to minimize bias',
	[ReviewType.MetaAnalysis]: 'A statistical analysis that combines the results of multiple scientific studies',
	[ConflictOfInterest.None]: 'The authors declared no conflict of interest and no external sources contradict this',
	[ConflictOfInterest.SomeLinks]: 'Some authors had links to biased persons or organizations in the past',
	[ConflictOfInterest.YesButOppositeResults]: 'The authors or funders have conflicting interests but the results are the opposite of what would benefit them',
	[ConflictOfInterest.Yes]: 'The authors or funders have conflicting interests that may have influenced the conclusion',
}


export function color_to_shadow(color: string | undefined): string
{
	if (!color)
		return '#000000';

	const hue = ColorLib.default(color).hue();

	if (hue < 63 || hue > 335)
		return '#800000';

	return '#000080';
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


export function impact_to_emoji(impact: NoteImpact | undefined): string
{
	if (impact === NoteImpact.ExtremelyNegative) return	'💩';
	if (impact === NoteImpact.VeryNegative) return		'😨';
	if (impact === NoteImpact.Negative) return			'👎';
	if (impact === NoteImpact.Neutral) return			'📝';
	if (impact === NoteImpact.Positive) return			'👍';
	if (impact === NoteImpact.VeryPositive) return		'🥰';
	if (impact === NoteImpact.ExtremelyPositive) return	'🏆';
	return												'🤷';
}


export function conflict_of_interest_to_color(conflict_of_interest: ConflictOfInterest | undefined): string
{
	if (conflict_of_interest === ConflictOfInterest.None) return					COLORS[Color.Green].default;
	if (conflict_of_interest === ConflictOfInterest.SomeLinks) return				'#ef8a37';
	if (conflict_of_interest === ConflictOfInterest.YesButOppositeResults) return	COLORS[Color.Green1H].default;
	if (conflict_of_interest === ConflictOfInterest.Yes) return						COLORS[Color.Red].default;
	return																			COLORS[Color.Gray].default;
}


export function impact_to_color(impact: NoteImpact | undefined): string
{
	if (impact === NoteImpact.ExtremelyNegative) return	'#ea3f60';
	if (impact === NoteImpact.VeryNegative) return		'#ee6a4b';
	if (impact === NoteImpact.Negative) return			'#ed9935';
	if (impact === NoteImpact.Neutral) return			COLORS[Color.Gray].default;
	if (impact === NoteImpact.Positive) return			'#a6d535';
	if (impact === NoteImpact.VeryPositive) return		'#68ce60';
	if (impact === NoteImpact.ExtremelyPositive) return	'#24c68c';
	return												COLORS[Color.Gray].default;
}
