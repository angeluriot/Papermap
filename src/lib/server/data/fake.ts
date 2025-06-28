import { ConflictOfInterest, JournalMissingReason, MissingReason, NoteImpact, PaperType, ReviewType, StudyOn, type DataPaper } from '$lib/types/paper';
import { type DataMap, type Group, type GroupNode, type MapTitle } from '$lib/types/map';
import { faker } from '@faker-js/faker';
import { EMOJI_NAMES } from '$lib/server/emojis';


function random_choice<T>(elements: T[], weights?: number[]): T
{
	if (!weights)
		weights = new Array(elements.length).fill(1);

	if (elements.length !== weights.length)
		throw new Error();

	const total_weight = weights.reduce((acc, weight) => acc + weight, 0);
	const random = Math.random() * total_weight;
	let cumulative_weight = 0;

	for (let i = 0; i < weights.length; i++)
	{
		cumulative_weight += weights[i];

		if (random < cumulative_weight)
			return elements[i];
	}

	return elements[elements.length - 1];
}


function random_times<T>(generator: () => T, min: number, max: number): T[]
{
	let count = Math.floor(Math.random() * (max - min + 1)) + min;
	let result: T[] = [];

	for (let i = 0; i < count; i++)
		result.push(generator());

	return result;
}


export function generate_paper(map: DataMap, journal_ids: { id: string, proba: number }[]): DataPaper
{
	const journal_id = random_choice(
		[random_choice(journal_ids.map(j => j.id), journal_ids.map(j => j.proba)), JournalMissingReason.NotFound, JournalMissingReason.NotPublished],
		[10, 1, 1],
	);

	const citations_count = random_choice(
		[5 + Math.round((Math.random() ** 4) * 500), MissingReason.NotSpecified] as (number | MissingReason.NotSpecified)[],
		[10, 1],
	);

	let quote = faker.lorem.sentence({ min: 15, max: 30 });

	for (let i = 0; i < quote.length; i++)
		if (quote[i] === ' ' && Math.random() < 0.05)
			quote = quote.slice(0, i) + ' [...]' + quote.slice(i);

	const consensus = random_choice([random_choice(Object.keys(map.consensus)), MissingReason.NoAccess], [10, 1]);
	const conclusion = random_choice(Object.keys(map.consensus[consensus === MissingReason.NoAccess ? 'no_consensus' : consensus].coherence))

	return {
		id: random_choice([faker.string.uuid(), undefined]),
		title: faker.lorem.sentence({ min: 8, max: 22 }),
		authors: random_times(() => faker.person.fullName(), 1, 4),
		year: 2025 - Math.round(Math.random() * 50),
		link: faker.internet.url(),
		journal: {
			id: journal_id,
			retracted: journal_id === JournalMissingReason.NotPublished ? false : random_choice([false, true], [10, 1]),
		},
		citations: {
			count: citations_count,
			critics: citations_count === MissingReason.NotSpecified ? false : random_choice([false, true], [10, 1]),
		},
		results: {
			consensus,
			conclusion,
			indirect: Math.random() < 0.5,
		},
		quote,
		review: Math.random() < 0.2 ? {
			type: random_choice(Object.keys(ReviewType) as ReviewType[]),
			reviews: Math.random() < 0.2,
			count: random_choice([5 + Math.round((Math.random() ** 3) * 200), random_choice([MissingReason.NoAccess, MissingReason.NotSpecified])], [10, 1]),
		} : undefined,
		type: random_choice(
			[random_choice(Object.keys(PaperType) as PaperType[]), random_choice(Object.keys(MissingReason) as MissingReason[])],
			[10, 1],
		),
		on: random_choice(
			[random_choice(Object.keys(StudyOn) as StudyOn[]), random_choice(Object.keys(MissingReason) as MissingReason[])],
			[10, 1],
		),
		sample_size: 5 + Math.round((Math.random() ** 5) * 10000),
		p_value: Math.random() < 0.9 && map.conclusions[conclusion].p_value ? {
			value: Math.random() * 0.05,
			less_than: Math.random() < 0.5,
		} : random_choice(Object.keys(MissingReason) as MissingReason[]),
		conflict_of_interest: random_choice([random_choice(Object.keys(ConflictOfInterest) as ConflictOfInterest[]), MissingReason.NoAccess], [10, 1]),
		notes: random_times(() => ({
			title: faker.lorem.sentence({ min: 2, max: 5 }).slice(0, -1),
			description: faker.lorem.sentence({ min: 5, max: 15 }).slice(0, -1),
			link: Math.random() < 0.5 ? faker.internet.url() : undefined,
			impact: random_choice(Object.keys(NoteImpact) as NoteImpact[]),
		}), 0, 3),
	}
}


export function generate_group(): Group
{
	const group_name = faker.lorem.words({ min: 1, max: 3 });

	return {
		id: group_name.toLowerCase().replace(/ /g, '_'),
		emoji: random_choice(Object.keys(EMOJI_NAMES)),
		name: group_name[0].toUpperCase() + group_name.slice(1),
		draft: false,
	}
}


export function generate_map_title(): MapTitle
{
	const short = faker.lorem.sentence({ min: 5, max: 8 }).slice(0, -1);
	const id = short.toLowerCase().replace(/ /g, '_')

	return {
		groups: [],
		id,
		draft: false,
		emoji: random_choice(Object.keys(EMOJI_NAMES)),
		question: {
			short: short + '?',
			long: faker.lorem.sentence({ min: 8, max: 12 }).slice(0, -1) + '?',
		},
		description: faker.lorem.sentence({ min: 20, max: 30 }).slice(0, -1),
		tags: faker.lorem.sentence({ min: 5, max: 8 }).slice(0, -1).split(' ').map(tag => tag.toLowerCase().replace(/[^a-z]/g, '')),
		url: random_choice(['/maps/do_vaccines_cause_autism']),
		hash: faker.string.uuid(),
		fake: true,
	}
}


export function generate_group_node(depth: number = 0): GroupNode
{
	const group = generate_group();
	const maps: MapTitle[] = [];
	const sub_groups: GroupNode[] = [];

	if (depth < 2)
		while (Math.random() < 0.5)
			sub_groups.push(generate_group_node(depth + 1));

	if (sub_groups.length === 0)
		maps.push(generate_map_title());

	for (let i = 0; i < Math.floor(Math.random() * 5); i++)
		maps.push(generate_map_title());

	return {
		...group,
		maps: maps.sort((a, b) => a.id.localeCompare(b.id)),
		sub_groups: sub_groups.sort((a, b) => a.id.localeCompare(b.id)),
	};
}
