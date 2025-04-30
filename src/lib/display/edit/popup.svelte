<script lang="ts">
	import Cross from '$lib/svgs/cross.svg';
	import Search from './search.svelte';

	let shown = $state(false);

	export function show()
	{
		shown = true;
	}

	export function hide()
	{
		shown = false;
	}
</script>

<svelte:window onkeydown={(event) => { if (event.key === 'Escape') hide(); }}/>

<div class="popup-container absolute left-0 top-0 w-full h-full" style="display: {shown ? 'block' : 'none'};">
	<div
		class="background absolute left-0 top-0 w-full h-full bg-[#01012629]"
		onclick={hide} onkeydown={null} role="button" tabindex={0}
	></div>
	<div class="popup absolute flex-center-col overflow-hidden">
		<div class="cross absolute cursor-pointer right-0 top-0" onclick={hide} onkeydown={null} role="button" tabindex={0}>
			<img src={Cross} alt="Close"/>
		</div>
		<Search/>
	</div>
</div>

<style>
	.popup-container
	{
		z-index: 10000;
	}

	.popup
	{
		z-index: 10001;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		background-color: white;
		border-radius: 1.8em;
		box-shadow: 0em 0.3em 5em #01012640;
		--padding-size: 3.5em;
		padding: calc(var(--padding-size) * 0.85) var(--padding-size) var(--padding-size) var(--padding-size);
		width: 35em;
		max-width: calc(100vw - 3em);
	}

	@media screen and (max-width: 430px)
	{
		.popup
		{
			--padding-size: 2.5em;
		}
	}

	.cross
	{
		border-radius: 1em;
		margin: 0.5em;
		padding: 0.8em;
		opacity: 0.5;
		transition: opacity 0.1s ease-in-out;
	}

	.cross:hover
	{
		opacity: 0.85;
	}

	.cross img
	{
		width: 1em;
		height: 1em;
	}
</style>
