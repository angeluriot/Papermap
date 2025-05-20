<script lang="ts">
	import Add from '$lib/svgs/add.svg';
	import Submit from '$lib/svgs/submit.svg';
	import Info from '$lib/display/buttons/info.svelte';

	const { add, submit }: { add: () => void, submit: () => Promise<void> } = $props();
</script>

<div class="buttons-container right-0 bottom-0 flex-center-col">
	<div class="relative button-container z-100" onclick={add} onkeydown={null} role="button" tabindex={0}>
		<img src={Add} alt="Add" class="button relative rounded-full img-unselectable"/>
		<Info text="Add a new paper" width={7.5} distance={3.2} />
	</div>
	<div class="relative button-container z-100" onclick={submit} onkeydown={null} role="button" tabindex={1}>
		<img src={Submit} alt="Submit" class="button relative rounded-full img-unselectable"/>
		<Info text="Submit your changes" width={8.5} distance={3.2} y_shift={-0.5} />
	</div>
</div>

<style>
	.buttons-container
	{
		gap: 0.9em;
		margin: 1.5em 1.3em;
	}

	.button-container
	{
		filter: drop-shadow(0em 0.1em 1.4em #00008041);
	}

	.button
	{
		cursor: pointer;
		transition: transform 0.2s ease-in-out;
		width: 3.6em;
		height: 3.6em;
		z-index: 102;
	}

	.button:hover
	{
		transform: scale(1.06);
	}

	.button:active
	{
		transition: none;
		transform: scale(1);
	}

	.button-container
	{
		--info-display: none;
	}

	.button-container:has(.button:hover)
	{
		--info-display: block;
	}
</style>
