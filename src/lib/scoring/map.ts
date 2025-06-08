import { ratio } from '$lib/utils';
import type { DataMap, Group, Map } from '$lib/types/map';
import type { Paper } from '$lib/types/paper';
import { score_paper } from './paper';
import type { Journal } from '$lib/types/journal';


const OVERVIEW_RANK_SCORE_COEF = 0.1;
const OVERVIEW_GAP_INCREASE = 3;


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

	sorted_items.forEach(([id], index) =>
	{
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


export function score_answers(map: Map): Record<string, number>
{
	let answer_scores: Record<string, number> = {};
	let paper_scores: Record<string, number> = {};

	for (const paper of Object.values(map.papers))
		paper_scores[paper.uuid] = paper.score.overall;

	let paper_rank_scores = compute_normalized_ranking(paper_scores);

	for (const paper of Object.values(map.papers))
	{
		const rank_score = paper_rank_scores[paper.uuid];
		const score = ((1 - OVERVIEW_RANK_SCORE_COEF) * paper.score.overall + OVERVIEW_RANK_SCORE_COEF * rank_score) ** OVERVIEW_GAP_INCREASE;
		const answer_id = paper.results.conclusion;

		if (!answer_scores[answer_id])
			answer_scores[answer_id] = 0;

		answer_scores[answer_id] += score;
	}

	for (const answer_id in map.conclusions)
		if (!answer_scores[answer_id])
			answer_scores[answer_id] = 0;

	const total = Object.values(answer_scores).reduce((acc, score) => acc + score, 0);

	for (const answer_id in answer_scores)
		answer_scores[answer_id] /= total;

	return answer_scores;
}


export function score_map(data_map: DataMap, journals: { [id: string]: Journal }): Map
{
	let papers: { [uuid: string]: Paper } = {};
	let index = 0;

	for (const data_paper of data_map.papers)
	{
		const paper = score_paper(data_map, data_paper.journal.id ? journals[data_paper.journal.id] : undefined, data_paper, index);
		papers[paper.uuid] = paper;
		index++;
	}

	let map = {
		...data_map,
		papers,
		overview: {}
	};

	map.overview = score_answers(map);

	return map;
}
