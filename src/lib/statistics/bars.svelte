<script lang="ts">
	import { BACKGROUND_COLOR } from '$lib/display/graph/background';
	import * as echarts from 'echarts';
	import { onDestroy,onMount } from 'svelte';

	const { title, x_axis_label, color, data, scoring }: {
		title: string,
		x_axis_label: string,
		color: string,
		data: number[],
		scoring?: { min: number, max: number },
	} = $props();

	let container: HTMLDivElement | null = null;
	let chart: echarts.ECharts | null = null;
	let width: number | undefined = $state();
	let height: number | undefined = $state();

	const { data_x, data_y } = $derived.by(() =>
	{
		let x = [];
		let y = [];

		for (let i = 0; i < 100; i += 1)
		{
			const max = i + 1 === 100 ? 1.1 : (i + 1) / 100;

			x.push(i);
			y.push(data.filter(d => d >= i / 100 && d < max).length);
		}

		return { data_x: x, data_y: y };
	});

	const graph_color = '#6d6d77';
	const font_size = $derived(width && height ? Math.min(4 + (width + height) / 120, 14) : 13);
	const font = $derived({
		fontFamily: 'Satoshi-Variable, sans-serif',
		fontWeight: 600,
		fontSize: font_size,
		color: graph_color,
	});

	// @ts-ignore
	const option: echarts.EChartsOption = $derived({
		title: {
			text: title,
			textAlign: 'left',
			left: 5,
			top: 0,
			textStyle: {
				...font,
				fontSize: font_size * 1.3,
				fontWeight: 650,
				color: '#303037',
			},
		},
		xAxis: {
			data: data_x,
			scale: true,
			axisLabel: {
				...font,
				formatter: (value: number) => (value / 100).toFixed(1).replace('.0', ''),
				interval: (index: number) => index === 99 || index % 10 === 0,
				showMinLabel: true,
				showMaxLabel: true,
			},
			axisLine: {
				lineStyle: {
					color: graph_color,
				},
			},
			name: x_axis_label,
			nameLocation: 'middle',
			nameTextStyle: font,
			min: 0,
			max: 99,
		},
		yAxis: {
			scale: true,
			axisLabel: font,
			axisLine: {
				lineStyle: {
					color: graph_color,
				},
			},
			name: 'Papers',
			nameLocation: 'middle',
			nameTextStyle: font,
		},
		textStyle: font,
		grid: {
			show: true,
			left: 0,
			right: 0,
			top: 28 + font_size * 1.3,
			bottom: 0,
			backgroundColor: BACKGROUND_COLOR,
			borderColor: 'transparent',
		},
		tooltip: {
			padding: [5, 10],
			borderWidth: 1,
			formatter: (params: any) =>
			{
				const x = data_x[params.dataIndex];
				const y = data_y[params.dataIndex];

				let result = `${y} papers between ${x / 100} and ${(x + 1) / 100}`;

				if (scoring)
				{
					const impact = Math.round((((scoring.max - scoring.min) * ((x + 0.5) / 100) + scoring.min) - 1.0) * 100);
					const sign = impact > 0 ? '+' : '';
					result += `<br/>Impact on paper score: ${sign}${impact}%`;
				}

				return result;
			},
		},
		series: [
			{
				type: 'bar',
				data: data_y,
				color: color,
				symbolSize: 10,
				barCategoryGap: '20%',
			},
		],
	});

	onMount(() =>
	{
		if (container)
		{
			chart = echarts.init(container);
			chart.setOption(option);
		}
	});

	onDestroy(() =>
	{
		chart?.dispose();
		chart = null;
	});

	$effect(() =>
	{
		if (chart && option)
			chart.setOption(option);
	});
</script>

<svelte:window onresize={() => chart?.resize()}/>

<div class="chart-wrapper" bind:clientWidth={width} bind:clientHeight={height}>
	<div class="chart" bind:this={container}></div>
</div>

<style>
	.chart-wrapper
	{
		position: relative;
		padding-left: 0.5em;
		width: 100%;
		height: 100%;
	}

	.chart
	{
		width: 100%;
		height: 100%;
	}
</style>
