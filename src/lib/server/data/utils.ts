import { ratio } from '$lib/utils';


export function compute_normalized_ranking(values: Record<string, number>): Record<string, number>
{
	if (Object.keys(values).length === 0)
		return {};

	// Group identical values
	let values_dict: Record<number, string[]> = {};

	for (const id in values)
	{
		const value = values[id];

		if (values_dict[value] === undefined)
			values_dict[value] = [id];
		else
			values_dict[value].push(id);
	}

	let rank = 0;
	let ranks: Record<string, number> = {};

	// Initially sort items by value
	const sorted_items = Object.entries(values).sort((a, b) => a[1] - b[1]);

	sorted_items.forEach(([id], index) => {
		ranks[id] = index;
	});

	// Compute ranks with averaging for identical values
	const sorted_values = Object.keys(values_dict).map(Number).sort((a, b) => a - b);

	for (const value of sorted_values)
	{
		let ids = values_dict[value];

		// Assign temporary rank values
		for (const id of values_dict[value])
		{
			ranks[id] = rank;
			rank++;
		}

		// Compute the average rank for the group
		const mean_rank = ids.reduce((sum, id) => sum + ranks[id], 0) / ids.length;

		// Update ranks with the average rank
		for (const id of ids)
			ranks[id] = mean_rank;
	}

	// Normalize ranks
	const all_ranks = Object.values(ranks);
	const min_rank = Math.min(...all_ranks);
	const max_rank = Math.max(...all_ranks);

	if (min_rank === max_rank)
		return {};

	let normalized: Record<string, number> = {};

	for (const id in ranks)
		normalized[id] = ratio(ranks[id], min_rank, max_rank);

	return normalized;
}
