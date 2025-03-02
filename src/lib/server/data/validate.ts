import type { DataMap } from '$lib/types/map';
import { JournalStatus, PaperType, ReviewType, StudyOn, type DataPaper } from '$lib/types/paper';
import { z } from 'zod';
import { InvalidDataError } from '$lib/server/errors';
import { Color } from '$lib/colors';


export const paper_schema = z.object({
	id: z.string().optional(),
	title: z.string(),
	authors: z.array(z.string()),
	journal: z.object({
		status: z.nativeEnum(JournalStatus),
		id: z.string().optional(),
	}).strict(),
	year: z.number().int(),
	link: z.string().optional(),
	results: z.object({
		consensus: z.string().optional(),
		conclusion: z.string(),
		indirect: z.boolean(),
	}).strict(),
	quote: z.string(),
	type: z.nativeEnum(PaperType).optional(),
	review: z.object({
		type: z.nativeEnum(ReviewType),
		count: z.number().int().nonnegative(),
	}).strict().optional(),
	on: z.nativeEnum(StudyOn).optional(),
	citations: z.object({
		count: z.number().int().nonnegative(),
		critics: z.boolean(),
	}).strict(),
	sample_size: z.number().int().nonnegative().optional(),
	p_value: z.object({
		value: z.number().nonnegative(),
		less_than: z.boolean(),
	}).strict().optional(),
	conflict_of_interest: z.boolean(),
	retracted: z.boolean(),
}).strict();


export function validate_paper(paper: DataPaper): void
{
	const result = paper_schema.safeParse(paper);

	if (!result.success)
		throw new InvalidDataError(result.error.errors[0].message);
}


const map_schema = z.object({
	question: z.string(),
	detailed_question: z.string(),
	answers: z.record(
		z.string(),
		z.object({
			text: z.string(),
			group: z.string(),
			color: z.nativeEnum(Color),
			neutral: z.boolean(),
			legend: z.boolean(),
		}).strict(),
	),
	type: z.object({
		no_causality: z.boolean(),
		no_random: z.boolean(),
		no_blind: z.boolean(),
		any: z.boolean(),
	}).strict(),
	on: z.object({
		any_animal: z.boolean(),
		any: z.boolean(),
	}).strict(),
	no_sample_size: z.boolean(),
	no_p_value: z.boolean(),
	papers: z.array(paper_schema),
}).strict();


export function validate_map(map: DataMap): void
{
	const result = map_schema.safeParse(map);

	if (!result.success)
		throw new InvalidDataError(result.error.errors[0].message);
}
