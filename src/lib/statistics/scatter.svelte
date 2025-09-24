<script lang="ts">
	import { BACKGROUND_COLOR } from '$lib/display/graph/background';
	import { float_to_text, int_to_text } from '$lib/display/utils';
	import { type ECharts, type EChartsOption, init as initChart } from 'echarts';
	import { onDestroy, onMount } from 'svelte';

	const { title, x_axis_label, x_axis_max, color, log_base, years, inverse, data }: {
		title: string,
		x_axis_label: string,
		x_axis_max?: number,
		color: string,
		log_base?: number,
		years?: true,
		inverse?: true,
		data: { x: number, y: number, text: string, score?: number, x_text?: string }[],
	} = $props();

	let container: HTMLDivElement | null = null;
	let chart: ECharts | null = null;
	let width: number | undefined = $state();
	let height: number | undefined = $state();

	function to_log(value: number)
	{
		return log_base ? (value > 0 ? Math.log(value) / Math.log(log_base) : 0) : value;
	}

	function from_log(value: number)
	{
		return log_base ? Math.pow(log_base, value) : value;
	}

	function number_to_text(value: number, axis = false)
	{
		if (axis)
		{
			for (const { exponent, symbol } of [
				{ exponent: 5, symbol: '⁵' },
				{ exponent: 6, symbol: '⁶' },
				{ exponent: 7, symbol: '⁷' },
				{ exponent: 8, symbol: '⁸' },
				{ exponent: 9, symbol: '⁹' },
			])
			{
				if (value === 10 ** exponent)
					return `10${symbol}`;
			}
		}

		if (value >= 10)
			return years ? value.toFixed(0) : int_to_text(Math.round(value));

		return float_to_text(value);
	}

	const graph_color = '#6d6d77';
	const font_size = $derived(width && height ? Math.min(4 + (width + height) / 120, 14) : 13);
	const font = $derived({
		fontFamily: 'Satoshi-Variable, sans-serif',
		fontWeight: 600,
		fontSize: font_size,
		color: graph_color,
	});
	const converted_data = $derived(data.map(point => ({ x: to_log(point.x), y: point.y, text: point.text, score: point.score, x_text: point.x_text })));

	const linear_regressions = $derived.by(() =>
	{
		const result: { x: number, y: number }[] = [];

		for (const used_data of [data, converted_data])
		{
			if (used_data.length < 2)
			{
				result.push({ x: 0, y: 0 });
				continue;
			}

			const sum_x = used_data.reduce((sum, point) => sum + point.x, 0);
			const sum_y = used_data.reduce((sum, point) => sum + point.y, 0);
			const sum_xy = used_data.reduce((sum, point) => sum + point.x * point.y, 0);
			const sum_xx = used_data.reduce((sum, point) => sum + point.x * point.x, 0);

			const slope = (used_data.length * sum_xy - sum_x * sum_y) / (used_data.length * sum_xx - sum_x * sum_x);
			const intercept = (sum_y - slope * sum_x) / used_data.length;

			result.push({ x: slope, y: intercept });
		}

		return {
			initial: result[0],
			log: result[1],
		};
	});

	const median_x = $derived.by(() =>
	{
		if (data.length === 0)
			return 0;

		const sorted_x = data.toSorted((a, b) => a.x - b.x);
		const middle = Math.floor(sorted_x.length / 2);

		if (sorted_x.length % 2 === 0)
			return (sorted_x[middle - 1].x + sorted_x[middle].x) / 2;

		return sorted_x[middle].x;
	});

	const lines = $derived.by(() =>
	{
		const result: { coord: number[], symbol: string }[][] = [];

		for (const { used_data, linear_regression } of [
			{ used_data: data, linear_regression: linear_regressions.initial },
			{ used_data: converted_data, linear_regression: linear_regressions.log },
		])
		{
			if (used_data.length < 2)
				result.push([{ coord: [0, 0], symbol: 'none' }, { coord: [0, 0], symbol: 'none' }]);

			const x_min = Math.min(...used_data.map(point => point.x));
			const x_max = Math.max(...used_data.map(point => point.x));

			result.push([
				{ coord: [x_min, linear_regression.x * x_min + linear_regression.y], symbol: 'none' },
				{ coord: [x_max, linear_regression.x * x_max + linear_regression.y], symbol: 'none' },
			]);
		}

		return {
			initial: result[0],
			log: result[1],
		};
	});

	// @ts-ignore
	const option: EChartsOption = $derived({
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
				formatter: (value: number) => number_to_text(from_log(value), true),
			},
			axisLine: {
				lineStyle: {
					color: graph_color,
				},
			},
			name: x_axis_label,
			nameLocation: 'middle',
			nameTextStyle: font,
			max: x_axis_max ? to_log(x_axis_max) : undefined,
			inverse: inverse,
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
				const data_point = converted_data[params.dataIndex];

				return (
					`<b>${data_point.text}</b><br/>` +
					`${x_axis_label}: ${data_point.x_text ?? number_to_text(from_log(params.data[0]))}<br/>` +
					(data_point.score !== undefined ? `${x_axis_label} score: ${number_to_text(data_point.score)}<br/>` : '') +
					`Paper score: ${number_to_text(params.data[1])}`
				);
			},
		},
		series: [
			{
				type: 'scatter',
				data: converted_data.map(point => [point.x, point.y]),
				color: color,
				symbolSize: font_size * 0.6,
				markLine: {
					lineStyle: {
						type: 'solid',
						cap: 'round',
						color: color,
						opacity: 0.6,
						width: 2,
					},
					tooltip: {
						formatter: () =>
						{
							const max_min = (lines.initial[1].coord[1] - lines.initial[0].coord[1]) * (inverse ? -1 : 1);
							const max_min_text = inverse ? 'max to min' : 'min to max';

							return (
								`Median ${x_axis_label.toLowerCase()}: ${number_to_text(median_x)}<br/>` +
								`Slope: ${max_min > 0 ? '+' : ''}${number_to_text(max_min)} from ${max_min_text}`
							);
						},
					},
					data: [lines.log],
				},
			},
		],
	});

	onMount(() =>
	{
		if (container)
		{
			chart = initChart(container);
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
		width: 100%;
		height: 100%;
	}

	.chart
	{
		width: 100%;
		height: 100%;
	}
</style>
