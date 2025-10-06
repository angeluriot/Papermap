export enum Color
{
	Red = 'Red',
	Red3Q = 'Red3Q',
	Red1H = 'Red1H',
	Red1Q = 'Red1Q',
	Yellow = 'Yellow',
	Gray = 'Gray',
	Green1H = 'Green1H',
	Green = 'Green',
	Cyan = 'Cyan',
	Blue1Q = 'Blue1Q',
	Blue1H = 'Blue1H',
	Blue3Q = 'Blue3Q',
	Blue = 'Blue',
}

export const COLORS = {
	[Color.Red]: {
		default: '#ea3f60',
		fill: '#db456c',
		stroke: '#bf1f49',
	},
	[Color.Red3Q]: {
		default: '#ef6a3b',
		fill: '#de6c49',
		stroke: '#cd462a',
	},
	[Color.Red1H]: {
		default: '#f29436',
		fill: '#e0924b',
		stroke: '#db6c35',
	},
	[Color.Red1Q]: {
		default: '#f0b02d',
		fill: '#e7af3b',
		stroke: '#dc8d2e',
	},
	[Color.Yellow]: {
		default: '#edcc24',
		fill: '#edcc2b',
		stroke: '#ddad26',
	},
	[Color.Gray]: {
		default: '#abb4d6',
		fill: '#abb4d6',
		stroke: '#9097bf',
	},
	[Color.Green1H]: {
		default: '#b4cc25',
		fill: '#abcc33',
		stroke: '#87b22b',
	},
	[Color.Green]: {
		default: '#24c68c',
		fill: '#38ce9c',
		stroke: '#19a481',
	},
	[Color.Cyan]: {
		default: '#48c7e5',
		fill: '#4fd5e0',
		stroke: '#45acba',
	},
	[Color.Blue1Q]: {
		default: '#53afe9',
		fill: '#57bbe5',
		stroke: '#4299bc',
	},
	[Color.Blue1H]: {
		default: '#5d97ed',
		fill: '#5ea1ea',
		stroke: '#3a75ba',
	},
	[Color.Blue3Q]: {
		default: '#5d86ed',
		fill: '#5e8bec',
		stroke: '#3c60b5',
	},
	[Color.Blue]: {
		default: '#5d75ed',
		fill: '#5d75ed',
		stroke: '#3e4baf',
	},
};
