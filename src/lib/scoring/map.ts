import { ratio } from '$lib/utils';
import type { DataMap, Map } from '$lib/types/map';
import type { Paper } from '$lib/types/paper';
import { score_paper } from './paper';
import type { Journal } from '$lib/types/journal';


const OVERVIEW_RANK_SCORE_COEF = 0.1;
const OVERVIEW_GAP_INCREASE = 3;
const MISSING_PAPERS_NB = 10;
const MISSING_PAPER_MAX = 0.8;
const BEST_PAPERS_COEF = 0.8;
const MAX_GROUP_COEF = 0.1;
const NO_CONSENSUS_COEF = 0.1;


export function compute_normalized_ranking(values: Record<string, number>): Record<string, number>
{
	if (Object.keys(values).length === 0)
		return {};

	if (Object.values(values).length === 1)
		return { [Object.keys(values)[0]]: 0.5 };

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


function compute_more_research(map: Map, paper_scores: Record<string, number>, answer_group_scores: { [k: string]: number }, total: number): number
{
	let best_papers = Object.values(paper_scores).sort((a, b) => b - a).slice(0, MISSING_PAPERS_NB);

	while (best_papers.length < MISSING_PAPERS_NB)
		best_papers.push(0.0);

	const best_mean = best_papers.reduce((acc, score) => acc + score, 0) / MISSING_PAPERS_NB;
	const best_score = ratio(best_mean, 0, MISSING_PAPER_MAX);
	const max_group_score = Object.values(answer_group_scores).reduce((acc, score) => Math.max(acc, score), 0) / total;
	const no_consensus_score = Object.values(map.papers).filter(paper => paper.results.consensus === 'no_consensus').length / Object.keys(map.papers).length;

	return (
		(1 - best_score) * BEST_PAPERS_COEF +
		(1 - max_group_score) * MAX_GROUP_COEF +
		no_consensus_score * NO_CONSENSUS_COEF
	);
}


export function score_answer_groups(map: Map): Record<string, number>
{
	let answer_group_scores = Object.fromEntries(Object.entries(map.conclusion_groups).map(([id, group]) => [id, 0]));

	if (Object.keys(map.papers).length === 0)
	{
		answer_group_scores['more_research_needed'] = 1.0;
		return answer_group_scores;
	}

	let paper_scores: Record<string, number> = {};

	for (const paper of Object.values(map.papers))
		paper_scores[paper.uuid] = paper.score;

	let paper_rank_scores = compute_normalized_ranking(paper_scores);

	for (const paper of Object.values(map.papers))
	{
		const rank_score = paper_rank_scores[paper.uuid];
		const score = ((1 - OVERVIEW_RANK_SCORE_COEF) * paper.score + OVERVIEW_RANK_SCORE_COEF * rank_score) ** OVERVIEW_GAP_INCREASE;
		const answer_group_id = map.conclusions[paper.results.conclusion].group;

		answer_group_scores[answer_group_id] += score;
	}

	let total = Object.values(answer_group_scores).reduce((acc, score) => acc + score, 0);
	let more_research_score = compute_more_research(map, paper_scores, answer_group_scores, total);

	answer_group_scores['more_research_needed'] = (total / (1 - more_research_score)) - total;
	total += answer_group_scores['more_research_needed'];

	for (const answer_group_id in answer_group_scores)
		answer_group_scores[answer_group_id] /= total;

	return answer_group_scores;
}


export function score_map(data_map: DataMap, journals: { [id: string]: Journal }): Map
{
	let papers: { [uuid: string]: Paper } = {};
	let index = 0;

	for (const data_paper of data_map.papers)
	{
		const paper = score_paper(data_map, journals[data_paper.journal.id], data_paper, index);
		papers[paper.uuid] = paper;
		index++;
	}

	let map = {
		...data_map,
		papers,
		overview: {}
	};

	map.overview = score_answer_groups(map);

	return map;
}
