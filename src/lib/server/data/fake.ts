import type { Journal } from '$lib/types/journal';
import { JournalStatus, PaperType, ReviewType, StudyOn, type DataPaper } from '$lib/types/paper';
import { type DataMap, type Group, type MapTitle } from '$lib/types/map';
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


export function generate_paper(map: DataMap, journals: { [id: string]: Journal }): DataPaper
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
		journal: {
			status: journal_status,
			id: journal_status === JournalStatus.Found ? random_choice(Object.keys(journals)) : undefined,
			retracted: journal_status === JournalStatus.NotPublished ? false : random_choice([false, true], [10, 1]),
		},
		year: 2025 - Math.round(Math.random() * 50),
		link: faker.internet.url(),
		results: {
			consensus,
			conclusion,
			indirect: Math.random() < 0.5,
		},
		quote,
		type,
		review: Math.random() < 0.2 ? {
			type: random_choice(Object.keys(ReviewType) as ReviewType[]),
			count: 5 + Math.round((Math.random() ** 3) * 200),
		} : undefined,
		on: type ? random_choice([...Object.keys(StudyOn), undefined] as (StudyOn | undefined)[]) : undefined,
		citations: {
			count: 5 + Math.round((Math.random() ** 4) * 500),
			critics: random_choice([false, true], [10, 1]),
		},
		sample_size: 5 + Math.round((Math.random() ** 5) * 10000),
		p_value: Math.random() < 0.9 && map.conclusions[conclusion].p_value ? {
			value: Math.random() * 0.05,
			less_than: Math.random() < 0.5,
		} : undefined,
		conflict_of_interest: Math.random() < 0.1,
		notes: random_times(() => ({
			title: faker.lorem.sentence({ min: 2, max: 5 }).slice(0, -1),
			description: faker.lorem.sentence({ min: 5, max: 15 }).slice(0, -1),
			positive: Math.random() < 0.5,
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


export function generate_map_title(group: { id: string, emoji: string, name: string }): MapTitle
{
	const short = faker.lorem.sentence({ min: 5, max: 8 }).slice(0, -1);
	const id = short.toLowerCase().replace(/ /g, '_')

	return {
		group,
		id,
		emoji: random_choice(Object.keys(EMOJI_NAMES)),
		question: {
			short: short + '?',
			long: faker.lorem.sentence({ min: 8, max: 12 }).slice(0, -1) + '?',
		},
		description: faker.lorem.sentence({ min: 20, max: 30 }).slice(0, -1),
		tags: faker.lorem.sentence({ min: 5, max: 8 }).slice(0, -1).split(' ').map(tag => tag.toLowerCase().replace(/[^a-z]/g, '')),
		url: random_choice(['/maps/other_subject', '/maps/sexual_education_effectiveness', '/maps/test']), //`/maps/${id}`,
		hash: faker.string.uuid(),
		fake: true,
	}
}
