'''
This script implements the scoring and ranking system explained here: TODO
'''

import os, json, math
from copy import deepcopy


# Journal data structure type
Journal = dict[str, str | list[str] | dict[str, int | float | None], dict[str, int | dict[str, int]] | None]

# The metrics with their coefficient
METRIC_COEFS = {
	'h': 1.0, # H index
	'if': 1.0, # Impact Factor
	'cs': 1.0, # CiteScore
	'sjr': 1.0, # SCImago Journal Rank
	'snip': 1.0, # Source Normalized Impact per Paper
	'ef': 1.0, # Eigenfactor Score
	'ai': 1.0, # Article Influence Score
	'self': 1.0, # Self-citation rate
	'rti': 0.5, # Rigor & Transparency Index
	'top': 0.5, # Transparency and Openness Promotion Factor
	'alt': 0.5 # Altmetric (Average News Mentions)
}

SELF_CITATION_THRESHOLD = 10 # The self-citation threshold (in %) before applying a penalty
EXP_CURVE_STRENGTH = 3 # The strength of the exponential curve
MIN_VALUES = 10 # The minimum number of values required to compute a score
NONE_PENALTY = 0.1 # The penalty for missing metrics


# Compute the ratio of a value between a min and a max
def ratio(value: float | int, min_value: float | int, max_value: float | int) -> float:
	return max(0.0, min(1.0, (value - min_value) / (max_value - min_value)))


# Apply an exponential curve to a value between 0 and 1
def exp_curve(value: float) -> float:
	return (math.exp(EXP_CURVE_STRENGTH * value) - 1) / (math.exp(EXP_CURVE_STRENGTH) - 1)


# Compute the normalized ranking of a list of values
def compute_normalized_ranking(values: dict[str, int | float]) -> list[float]:
	if len(values) == 0:
		return {}

	# Group identical values
	values_dict = {}

	for id, value in values.items():
		if value not in values_dict:
			values_dict[value] = [id]
		else:
			values_dict[value].append(id)

	rank = 0
	ranks = {id: i for i, (id, _) in enumerate(sorted(values.items(), key=lambda x: x[1]))}

	# Compute ranks
	for value in sorted(list(values_dict.keys())):
		for id in values_dict[value]:
			ranks[id] = rank
			rank += 1

		# Apply the average rank for identical values
		mean_rank = sum(ranks[id] for id in values_dict[value]) / len(values_dict[value])

		for id in values_dict[value]:
			ranks[id] = mean_rank

	# Normalize ranks
	min_rank = min(ranks.values())
	max_rank = max(ranks.values())

	if min_rank == max_rank:
		return {}

	return {id: ratio(rank, min_rank, max_rank) for id, rank in ranks.items()}


# Compute the scores of a metric
def compute_scores(metric_values: dict[str, int | float], metric: str) -> dict[str, float]:
	if len(metric_values) < MIN_VALUES:
		return {}

	# Normalize and inverted values for self-citation rate
	if metric == 'self':
		return {id: exp_curve(1.0 - ratio(value, SELF_CITATION_THRESHOLD, 100)) for id, value in metric_values.items()}

	ranks = compute_normalized_ranking(metric_values)

	# Linear ranking for RTI and TOP factor
	if metric in ['rti', 'top']:
		return {id: rank for id, rank in ranks.items()}

	# Exponential curve of the ranking for the other metrics
	return {id: exp_curve(rank) for id, rank in ranks.items()}


# Compute the scores of the journals
def main() -> None:

	if os.path.exists('./data/journals/data.json'):
		os.remove('./data/journals/data.json')

	# === Load the raw data === #

	with open('./data/journals/raw_data.json', 'r', encoding='utf-8') as file:
		data = json.load(file)

	journals: list[Journal] = {journal['id']: journal for journal in data['journals']}
	SCOPES: dict[str, list[str]] = data['scopes']
	SCOPES_LIST: list[str] = list(SCOPES.keys()) + [scope for scopes in SCOPES.values() for scope in scopes]

	# === Keep only rankable journals === #

	rankable_journals: dict[str, Journal] = {}

	for id, journal in journals.items():
		journal_copy = deepcopy(journal)

		# Skip if no metrics
		if all(metric is None for metric in journal_copy['metrics'].values()):
			continue

		rankable_journals[id] = journal_copy

	total_size = len(rankable_journals)
	print(f'Ranking {total_size:,} journals out of {len(journals):,}')

	# === List journal scopes === #

	scopes = {}

	for id, journal in rankable_journals.items():
		scope_list = []

		for scope in journal['scopes']:
			if scope == 'Multidisciplinary':
				scope_list.extend(SCOPES_LIST)
			elif scope in SCOPES:
				scope_list.extend(SCOPES[scope])
			else:
				scope_list.append(scope)

		scopes[id] = list(set(scope_list))

	# === Compute metric scores === #

	metric_scores: dict[str, dict[str, float]] = {id: {metric: None for metric in METRIC_COEFS} for id in rankable_journals}

	for metric in METRIC_COEFS:
		# Compute scores for the journals with the metric
		journal_ids = [id for id, journal in rankable_journals.items() if journal['metrics'][metric] is not None]
		scores = compute_scores({id: rankable_journals[id]['metrics'][metric] for id in journal_ids}, metric)

		for id in scores:
			metric_scores[id][metric] = scores[id]

		# Self-citation rate scores don't rely on ranking
		if metric == 'self':
			continue

		# Compute scores for each scope
		scope_scores: dict[str, list[float]] = {id: [] for id in rankable_journals}

		for scope in SCOPES_LIST:
			scope_journal_ids = [id for id in journal_ids if scope in scopes[id]]
			scores = compute_scores({id: rankable_journals[id]['metrics'][metric] for id in scope_journal_ids}, metric)

			for id in scores:
				scope_scores[id].append(scores[id])

		# Merge all scope scores and merge it with the global metric score
		for id in scope_scores:
			if len(scope_scores[id]) > 0:
				metric_scores[id][metric] = (metric_scores[id][metric] + (sum(scope_scores[id]) / len(scope_scores[id]))) / 2

	# === Compute overall scores === #

	overall_scores: dict[str, float] = {}

	for id, journal in rankable_journals.items():
		score = 0.0
		total = 0.0
		none_penalty = NONE_PENALTY

		# Fill nominator and denominator of the weighted average
		for metric in METRIC_COEFS:
			if journal['metrics'][metric] is not None:
				score += metric_scores[id][metric] * METRIC_COEFS[metric]
				total += METRIC_COEFS[metric]
			else:
				total += METRIC_COEFS[metric] * none_penalty
				none_penalty += NONE_PENALTY # Increase the penalty for each missing metric

		# Compute the global score
		overall_scores[id] = score / total

	# Merge the overall scores with the exponential curve of the ranking
	overall_scores = {id: (overall_scores[id] + exp_curve(rank)) / 2 for id, rank in compute_normalized_ranking(overall_scores).items()}

	# === Update journals data === #

	# Add scores to journals
	for id, score in overall_scores.items():
		journals[id]['scores'] = {'oa': score}

		for metric in METRIC_COEFS:
			journals[id]['scores'][metric] = metric_scores[id][metric] if metric_scores[id][metric] is not None else None

	# Add missing scores
	for journal in journals.values():
		if 'scores' not in journal:
			journal['scores'] = {metric: None for metric in ['oa'] + list(METRIC_COEFS.keys())}

	# Sort by overall rank
	journals_list = sorted(list(journals.values()), key=lambda journal: journal['scores']['oa'] if journal['scores']['oa'] is not None else -1, reverse=True)

	# === Save === #

	with open('./data/journals/data.json', 'w', encoding='utf-8') as file:
		json.dump(journals_list, file, ensure_ascii=False)


if __name__ == '__main__':
	main()
