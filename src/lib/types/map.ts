import type { DataPaper, Paper } from './paper';
import type { Color } from '$lib/colors';


interface BaseMap
{
	groups: Group[];
	id: string;
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
	conclusion_groups: {
		[id: string]: {
			text: string,
			color: Color,
		},
	};
	conclusions: {
		[id: string]: {
			group: string,
			emoji: string,
			text: string,
			description: string,
			p_value: boolean,
		},
	};
	type: {
		no_blind: boolean,
		no_random: boolean,
		no_causality: boolean,
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


export interface Map extends BaseMap
{
	papers: { [uuid: string]: Paper };
	overview: Record<string, number>;
}


export interface Group
{
	id: string;
	emoji: string;
	name: string;
	draft: boolean;
}


export interface GroupNode extends Group
{
	maps: MapTitle[];
	sub_groups: GroupNode[];
}


export interface MapTitle
{
	groups: Group[];
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
