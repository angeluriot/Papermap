export enum Color
{
	Green = 'Green',
	Green1H = 'Green1H',
	Gray = 'Gray',
	Red1H = 'Red1H',
	Red = 'Red',
}

export const COLORS = {
	[Color.Green]: {
		fill: '#38ceb1',
		stroke: '#17a096',
	},
	[Color.Green1H]: {
		fill: '#abcc33',
		stroke: '#87b22b',
	},
	[Color.Gray]: {
		fill: '#abb4d6',
		stroke: '#9097bf',
	},
	[Color.Red1H]: {
		fill: '#e0924b',
		stroke: '#db6c35',
	},
	[Color.Red]: {
		fill: '#db456c',
		stroke: '#bf1f49',
	},
}
