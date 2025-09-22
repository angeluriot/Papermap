<script lang="ts">
	import { BACKGROUND_COLOR } from '$lib/display/graph/background';
	import { float_to_text } from '$lib/display/utils';
	import * as echarts from 'echarts';
	import { onDestroy,onMount } from 'svelte';

	const { title, x_label, x_axis_values, x_axis_multiline, jitter, color, data }: {
		title: string,
		x_label: string,
		x_axis_values: string[],
		x_axis_multiline?: true,
		jitter?: number,
		color: string,
		data: { x: string, y: number, text: string, score?: number }[],
	} = $props();

	let container: HTMLDivElement | null = null;
	let chart: echarts.ECharts | null = null;
	let width: number | undefined = $state();
	let height: number | undefined = $state();

	const graph_color = '#6d6d77';
	const font_size = $derived(width && height ? Math.min(4 + (width + height) / 120, 14) : 13);
	const font = $derived({
		fontFamily: 'Satoshi-Variable, sans-serif',
		fontWeight: 600,
		fontSize: font_size,
		color: graph_color,
	});

	const mean_data = $derived.by(() =>
	{
		const category_means: { [key: string]: number[] } = {};

		for (const point of data)
		{
			if (!category_means[point.x])
				category_means[point.x] = [];

			category_means[point.x].push(point.y);
		}

		return x_axis_values.map(category =>
		{
			const values = category_means[category] || [];
			const mean = values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
			return [category, mean];
		});
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
			scale: true,
			axisLabel: {
				...font,
				lineHeight: x_axis_multiline ? font_size * 1.25 : font_size * 1.8,
				interval: () => true,
			},
			axisLine: {
				lineStyle: {
					color: graph_color,
				},
			},
			nameTextStyle: x_axis_multiline ? undefined : {
				...font,
				fontSize: 0,
				lineHeight: 0,
			},
			data: x_axis_values,
			name: x_axis_multiline ? undefined : ' ',
			nameLocation: x_axis_multiline ? undefined : 'middle',
			jitter: jitter && width ? jitter * width : 0,
		},
		yAxis: {
			scale: true,
			axisLabel: font,
			axisLine: {
				lineStyle: {
					color: graph_color,
				},
			},
			name: 'Paper score',
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
				if (params.seriesType === 'line')
					return `Mean paper score: ${float_to_text(params.data[1])}`;

				const data_point = data[params.dataIndex];

				return (
					`<b>${data_point.text}</b><br/>` +
					(data_point.score !== undefined ? `${x_label} score: ${float_to_text(data_point.score)}<br/>` : '') +
					`Paper score: ${float_to_text(params.data[1])}`
				);
			},
		},
		series: [
			{
				type: 'scatter',
				data: data.map(point => [point.x, point.y]),
				color: color,
				symbolSize: font_size * 0.6,
			},
			{
				type: 'line',
				data: mean_data,
				color: '#303037',
				lineStyle: {
					type: 'dashed',
					width: 2,
				},
				symbol: 'circle',
				symbolSize: font_size * 0.6,
				name: 'Category Mean',
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
