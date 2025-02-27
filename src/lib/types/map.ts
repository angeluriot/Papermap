import type { DataPaper, Paper, PaperType, StudyOn } from './paper';
import type { Color } from '$lib/colors';


interface BaseMap
{
	question: string;
	detailed_question: string;
	answers: {
		[id: string]: {
			group: string,
			color: Color,
			neutral: boolean,
			legend: boolean,
		}
	};
	type: {
		no_causality: boolean;
		no_random: boolean;
		no_blind: boolean;
		any: boolean;
	}
	on: {
		any_animal: boolean;
		any: boolean;
	};
	no_sample_size: boolean;
	no_p_value: boolean;
}


export interface DataMap extends BaseMap
{
	papers: DataPaper[];
}


export interface Map extends BaseMap
{
	id: string;
	papers: Paper[];
}
