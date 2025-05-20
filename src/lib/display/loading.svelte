<script lang="ts">
	const { color }: { color: string } = $props();
</script>

<div class="lds-ellipsis" style="color: {color};"><div></div><div></div><div></div><div></div></div>

<style>
	.lds-ellipsis
	{
		opacity: 0.6;
		transform: translateY(0.6em);
	}

	.lds-ellipsis, .lds-ellipsis div
	{
		box-sizing: border-box;
	}

	.lds-ellipsis
	{
		display: inline-block;
		position: relative;
		width: 8em;
		height: 8em;
	}

	.lds-ellipsis div
	{
		position: absolute;
		top: 3.333333em;
		width: 1.333333em;
		height: 1.333333em;
		border-radius: 50%;
		background: currentColor;
		animation-timing-function: cubic-bezier(0, 1, 1, 0);
	}

	.lds-ellipsis div:nth-child(1)
	{
		left: 0.8em;
		animation: lds-ellipsis1 0.6s infinite;
	}

	.lds-ellipsis div:nth-child(2)
	{
		left: 0.8em;
		animation: lds-ellipsis2 0.6s infinite;
	}

	.lds-ellipsis div:nth-child(3)
	{
		left: 3.2em;
		animation: lds-ellipsis2 0.6s infinite;
	}

	.lds-ellipsis div:nth-child(4)
	{
		left: 5.6em;
		animation: lds-ellipsis3 0.6s infinite;
	}

	@keyframes lds-ellipsis1
	{
		0%
		{
			transform: scale(0);
		}

		100%
		{
			transform: scale(1);
		}

	}

	@keyframes lds-ellipsis3
	{
		0%
		{
			transform: scale(1);
		}

		100%
		{
			transform: scale(0);
		}
	}

	@keyframes lds-ellipsis2
	{
		0%
		{
			transform: translate(0, 0);
		}

		100%
		{
			transform: translate(2.4em, 0);
		}
	}
</style>
