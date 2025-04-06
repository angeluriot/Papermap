<script lang="ts">
	const { title, text, width, distance, y_shift }: { title?: string, text: string, width: number, distance: number, y_shift?: number } = $props();
</script>

<div class="info absolute unselectable">
	<div class="arrow absolute" style="left: -{distance + 0.8}em;"></div>
	<div class="bubble absolute flex-center-col" style="width: {width}em; left: -{distance}em; {y_shift ? `top: ${y_shift}em` : ''}">
		{#if title}
			<span class="title">{title}</span>
		{/if}
		<span class="text">{text}</span>
	</div>
</div>

<style>
	.info
	{
		display: var(--info-display);
		left: 50%;
		top: 50%;
		z-index: 1001;
	}

	.arrow
	{
		background-color: white;
		width: 2.5em;
		height: 2.5em;
		transform-origin: 0 0;
		transform: rotate(45deg) translate(-50%, -50%);
		border-radius: 0.4em;
	}

	.bubble
	{
		background-color: white;
		transform: translate(-100%, -50%);
		border-radius: 1.2em;
		gap: 0.4em;
		padding: 1em 1.3em;
	}

	.title
	{
		font-family: Satoshi-Variable;
		line-height: 1.25em;
		font-weight: 700;
		text-align: center;
	}

	.text
	{
		font-family: Satoshi-Variable;
		line-height: 1.25em;
		font-weight: 500;
		text-align: center;
	}
</style>
