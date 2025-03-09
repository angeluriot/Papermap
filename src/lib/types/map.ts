import type { DataPaper, Paper } from './paper';
import type { Color } from '$lib/colors';


interface BaseMap
{
	emoji: string;
	question: string;
	detailed_question: string;
	tags: string[];
	answers: {
		[id: string]: {
			text: string,
			group: string,
			color: Color,
			neutral: boolean,
			legend: boolean,
		}
	};
	type: {
		no_causality: boolean,
		no_random: boolean,
		no_blind: boolean,
		any: boolean,
	}
	on: {
		any_animal: boolean,
		any: boolean,
	};
	no_sample_size: boolean;
	no_p_value: boolean;
}


export interface DataMap extends BaseMap
{
	papers: DataPaper[];
}


export interface Group
{
	id: string;
	emoji: string;
	name: string;
}


export interface Map extends BaseMap
{
	group: Group;
	id: string;
	papers: Paper[];
}
