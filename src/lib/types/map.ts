import type { DataPaper, Paper } from './paper';
import type { Color } from '$lib/colors';


interface BaseMap
{
	draft: boolean;
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
	fake?: true;
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
	papers: { [uuid: string]: Paper };
	overview: Record<string, number>;
}


export interface MapTitle
{
	group: Group;
	id: string;
	draft: boolean;
	emoji: string;
	question: {
		short: string,
		long: string,
	};
	description: string;
	tags: string[];
	url: string;
	hash: string;
	fake?: true;
}
