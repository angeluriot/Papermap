import type { DataMap, Group } from '$lib/types/map';
import { JournalStatus, NoteImpact, PaperType, ReviewType, StudyOn, type DataPaper } from '$lib/types/paper';
import { z } from 'zod';
import { InvalidInternalDataError } from '$lib/errors';
import { Color } from '$lib/colors';
import { EMOJI_NAMES } from '../emojis';


export const paper_schema = z.object({
	id: z.string().optional(),
	title: z.string().nonempty(),
	authors: z.array(z.string().nonempty()).min(1).max(4),
	year: z.number().min(1500).max(new Date().getFullYear() + 1).int(),
	link: z.string().nonempty(),
	journal: z.object({
		status: z.nativeEnum(JournalStatus),
		id: z.string().optional(),
		retracted: z.boolean(),
	}).strict(),
	citations: z.object({
		count: z.number().int().min(0),
		critics: z.boolean(),
	}).strict(),
	results: z.object({
		consensus: z.string(),
		conclusion: z.string(),
		indirect: z.boolean(),
	}).strict(),
	quote: z.string().nonempty(),
	review: z.object({
		type: z.nativeEnum(ReviewType),
		count: z.number().int().min(1),
	}).strict().optional(),
	type: z.nativeEnum(PaperType).optional(),
	on: z.nativeEnum(StudyOn).optional(),
	sample_size: z.number().int().min(1).optional(),
	p_value: z.object({
		value: z.number().min(0).max(1),
		less_than: z.boolean(),
	}).strict().optional(),
	conflict_of_interest: z.boolean(),
	notes: z.array(
		z.object({
			title: z.string().nonempty(),
			description: z.string().nonempty(),
			impact: z.nativeEnum(NoteImpact),
		}).strict(),
	),
}).strict();


const group_schema = z.object({
	id: z.string().nonempty(),
	emoji: z.string().nonempty(),
	name: z.string().nonempty(),
	draft: z.boolean(),
}).strict();


export function validate_group(group: Group): void
{
	const result = group_schema.safeParse(group);

	if (!result.success)
		throw new InvalidInternalDataError(`Invalid group ${group.id}: ${result.error.errors[0].message}`);

	if (EMOJI_NAMES[group.emoji as keyof typeof EMOJI_NAMES] === undefined)
		throw new InvalidInternalDataError(`Emoji SVG file not found: ${group.emoji}`);
}


const map_schema = z.object({
	groups: z.array(group_schema),
	id: z.string().nonempty(),
	draft: z.boolean(),
	emoji: z.string().nonempty(),
	question: z.object({
		short: z.string().nonempty(),
		long: z.string().nonempty(),
	}).strict(),
	description: z.string().nonempty(),
	tags: z.array(z.string().nonempty()).min(1),
	consensus: z.record(
		z.string(),
		z.object({
			emoji: z.string().nonempty(),
			text: z.string().nonempty(),
			description: z.string().nonempty(),
			color: z.nativeEnum(Color),
			coherence: z.record(
				z.string().nonempty(),
				z.number().min(0).max(1),
			),
		}).strict(),
	),
	conclusion_groups: z.record(
		z.string(),
		z.object({
			text: z.string().nonempty(),
			color: z.nativeEnum(Color),
		}).strict(),
	),
	conclusions: z.record(
		z.string(),
		z.object({
			group: z.string().nonempty(),
			emoji: z.string().nonempty(),
			text: z.string().nonempty(),
			description: z.string().nonempty(),
			p_value: z.boolean(),
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
	papers: z.array(paper_schema),
	fake: z.literal(true).optional(),
}).strict();


export function validate_map(map: DataMap): void
{
	const result = map_schema.safeParse(map);

	if (!result.success)
		throw new InvalidInternalDataError(`Invalid map ${map.id}: ${result.error.errors[0].message}`);

	if (EMOJI_NAMES[map.emoji as keyof typeof EMOJI_NAMES] === undefined)
		throw new InvalidInternalDataError(`Emoji SVG file not found: ${map.emoji}`);

	for (const consensus of Object.values(map.consensus))
		if (EMOJI_NAMES[consensus.emoji as keyof typeof EMOJI_NAMES] === undefined)
			throw new InvalidInternalDataError(`Emoji SVG file not found: ${consensus.emoji}`);

	for (const conclusion of Object.values(map.conclusions))
		if (EMOJI_NAMES[conclusion.emoji as keyof typeof EMOJI_NAMES] === undefined)
			throw new InvalidInternalDataError(`Emoji SVG file not found: ${conclusion.emoji}`);

	if (map.conclusion_groups['more_research_needed'] === undefined)
		throw new InvalidInternalDataError(`Conclusion group "more_research_needed" not found in map ${map.id}`);
}
