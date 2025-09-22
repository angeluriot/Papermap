export enum Color
{
	Green = 'Green',
	Green1H = 'Green1H',
	Gray = 'Gray',
	Yellow = 'Yellow',
	Red1H = 'Red1H',
	Red = 'Red',
}

export const COLORS = {
	[Color.Green]: {
		default: '#24c68c',
		fill: '#38ceb1',
		stroke: '#17a096',
	},
	[Color.Green1H]: {
		default: '#b4cc25',
		fill: '#abcc33',
		stroke: '#87b22b',
	},
	[Color.Gray]: {
		default: '#abb4d6',
		fill: '#abb4d6',
		stroke: '#9097bf',
	},
	[Color.Yellow]: {
		default: '#edcc24',
		fill: '#edcc2b',
		stroke: '#ddad26',
	},
	[Color.Red1H]: {
		default: '#f29436',
		fill: '#e0924b',
		stroke: '#db6c35',
	},
	[Color.Red]: {
		default: '#ea3f60',
		fill: '#db456c',
		stroke: '#bf1f49',
	},
};
