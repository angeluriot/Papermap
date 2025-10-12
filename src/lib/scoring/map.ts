import { score_paper } from './paper';
import type { Journal } from '$lib/types/journal';
import type { DataMap, Map } from '$lib/types/map';
import type { Paper } from '$lib/types/paper';


const OVERVIEW_GAP_INCREASE = 2;
const MORE_RESEARCH_GAP_INCREASE = 5;
const MORE_RESEARCH_MAX = 5;
const MORE_RESEARCH_LIMIT = 0.95;
const MIN_GROUP_SIZE = 0.01;


export function score_answer_groups(map: Map): Record<string, number>
{
	const answer_group_scores = Object.fromEntries(Object.entries(map.conclusion_groups).map(([id, _]) => [id, 0]));

	if (Object.keys(map.papers).length === 0)
	{
		answer_group_scores['more_research_needed'] = 1.0;
		return answer_group_scores;
	}

	let total_scores = 0;

	for (const paper of Object.values(map.papers))
	{
		const answer_group_id = map.conclusions[paper.results.conclusion].group;

		answer_group_scores[answer_group_id] += paper.score ** OVERVIEW_GAP_INCREASE;
		total_scores += Math.min(paper.score ** MORE_RESEARCH_GAP_INCREASE, paper.score);
	}

	let total = Object.values(answer_group_scores).reduce((acc, score) => acc + score, 0);
	const more_research_score = Math.min(Math.max(MORE_RESEARCH_MAX - total_scores, 0) / MORE_RESEARCH_MAX, MORE_RESEARCH_LIMIT);

	answer_group_scores['more_research_needed'] = (total / (1 - more_research_score)) - total;
	total += answer_group_scores['more_research_needed'];

	for (const answer_group_id in answer_group_scores)
		answer_group_scores[answer_group_id] /= total;

	for (const id in answer_group_scores)
		if (answer_group_scores[id] > 0.0)
			answer_group_scores[id] = Math.max(answer_group_scores[id], MIN_GROUP_SIZE);

	total = Object.values(answer_group_scores).reduce((acc, score) => acc + score, 0);

	for (const answer_group_id in answer_group_scores)
		answer_group_scores[answer_group_id] /= total;

	return answer_group_scores;
}


export function score_map(data_map: DataMap, journals: { [id: string]: Journal }): Map
{
	const papers: { [uuid: string]: Paper } = {};

	for (const data_paper of data_map.papers)
		papers[data_paper.uuid] = score_paper(data_map, journals[data_paper.journal.id], data_paper);

	const map = {
		...data_map,
		papers,
		overview: {},
	};

	map.overview = score_answer_groups(map);

	return map;
}
