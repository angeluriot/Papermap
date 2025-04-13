import type { DataPaper, Paper } from './paper';
import type { Color } from '$lib/colors';


interface BaseMap
{
	emoji: string;
	question: {
		short: string,
		long: string,
	};
	description: string;
	tags: string[];
	consensus: {
		[id: string]: {
			emoji: string,
			text: string,
			description: string,
			color: Color,
			coherence: {
				[id: string]: number,
			},
		},
	};
	conclusions: {
		[id: string]: {
			emoji: string,
			text: string,
			description: string,
			color: Color,
			p_value: boolean,
		},
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
	overview: Record<string, number>;
}


export interface MapTitle
{
	group: {
		id: string,
		emoji: string,
		name: string,
	};
	id: string;
	emoji: string;
	question: {
		short: string,
		long: string,
	};
	description: string;
	tags: string[];
	url: string;
}
