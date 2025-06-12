import { JournalStatus, NoteImpact, PaperType, ReviewType, StudyOn, type DataPaper } from '$lib/types/paper';
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
	const journal_status = random_choice(
		[JournalStatus.NotPublished, JournalStatus.NotFound, JournalStatus.Found],
		[1, 1, 10]
	);

	let quote = faker.lorem.sentence({ min: 15, max: 30 });

	for (let i = 0; i < quote.length; i++)
		if (quote[i] === ' ' && Math.random() < 0.05)
			quote = quote.slice(0, i) + ' [...]' + quote.slice(i);

	const type = random_choice([...Object.keys(PaperType), undefined] as (PaperType | undefined)[])
	const consensus = random_choice(Object.keys(map.consensus))
	const conclusion = random_choice(Object.keys(map.conclusions).filter(answer => map.consensus[consensus].coherence[answer] !== undefined))

	return {
		id: random_choice([faker.string.uuid(), undefined]),
		title: faker.lorem.sentence({ min: 8, max: 22 }),
		authors: random_times(() => faker.person.fullName(), 1, 5),
		year: 2025 - Math.round(Math.random() * 50),
		link: faker.internet.url(),
		journal: {
			status: journal_status,
			id: journal_status === JournalStatus.Found ? random_choice(journal_ids.map(j => j.id), journal_ids.map(j => j.proba)) : undefined,
			retracted: journal_status === JournalStatus.NotPublished ? false : random_choice([false, true], [10, 1]),
		},
		citations: {
			count: 5 + Math.round((Math.random() ** 4) * 500),
			critics: random_choice([false, true], [10, 1]),
		},
		results: {
			consensus,
			conclusion,
			indirect: Math.random() < 0.5,
		},
		quote,
		review: Math.random() < 0.2 ? {
			type: random_choice(Object.keys(ReviewType) as ReviewType[]),
			count: 5 + Math.round((Math.random() ** 3) * 200),
		} : undefined,
		type,
		on: type ? random_choice([...Object.keys(StudyOn), undefined] as (StudyOn | undefined)[]) : undefined,
		sample_size: 5 + Math.round((Math.random() ** 5) * 10000),
		p_value: Math.random() < 0.9 && map.conclusions[conclusion].p_value ? {
			value: Math.random() * 0.05,
			less_than: Math.random() < 0.5,
		} : undefined,
		conflict_of_interest: Math.random() < 0.1,
		notes: random_times(() => ({
			title: faker.lorem.sentence({ min: 2, max: 5 }).slice(0, -1),
			description: faker.lorem.sentence({ min: 5, max: 15 }).slice(0, -1),
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
		url: random_choice(['/maps/map_1', '/maps/map_2', '/maps/map_3', '/maps/map_4']), //`/maps/${id}`,
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
