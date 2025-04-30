<script lang="ts">
	let title = $state('');
	let description = $state('');
</script>

<div class="search-container flex-center-col">
	<h1 class="unselectable">Add a new paper</h1>
	<div class="input">
		<div class="label unselectable flex-center-row">
			<span>Title</span>
			<span class="required">*</span>
		</div>
		<input bind:value={title} type="text" placeholder="A simple question that can be answered by science"/>
	</div>
	<div class="input">
		<div class="label unselectable">
			<span>Description</span>
			<span class="optional"><i>(optional)</i></span>
		</div>
		<textarea bind:value={description} placeholder="Links to papers you have already found"></textarea>
	</div>
	<button class="button flex-center-col {title.trim().length > 0 ? '' : 'disabled'}">
		Add the paper
	</button>
</div>

<style>
	.search-container
	{
		gap: 1.5em;
		width: 100%;
	}

	h1
	{
		color: #303037;
		font-size: 1.25em;
		font-family: Satoshi-Variable;
		font-weight: 500;
		line-height: 1.5em;
		margin-bottom: 0.5em;
	}

	.input
	{
		width: 100%;
		max-width: calc(100vw - 3em);
		display: flex;
		flex-direction: column;
		justify-content: start;
		align-items: start;
		color: #303037;
	}

	.input .label
	{
		font-family: Satoshi-Variable;
		font-weight: 500;
		line-height: 1.5em;
		border-radius: 0.5em;
		margin-left: 0.2em;
	}

	.required
	{
		font-weight: 800;
		font-size: 1.3em;
		line-height: 0.5em;
		color: #ff2b2b;
		margin-bottom: 0.2em;
	}

	.label .optional
	{
		font-weight: 450;
		color: rgb(144, 144, 163);
	}

	.input input, .input textarea
	{
		width: 100%;
		border-color: rgb(219, 219, 232);
		border-width: 0.145em;
		background-color: rgb(251, 251, 253);
		padding: 0.4em 0.6em;
		font-family: Satoshi-Variable;
		font-weight: 465;
		line-height: 1.5em;
		border-radius: 0.5em;
		color: rgb(77, 77, 92);
	}

	.input textarea
	{
		resize: none;
		height: 8em;
	}

	.input input:focus, .input textarea:focus
	{
		outline: none;
		border-color: rgb(173, 173, 194);
		border-width: 0.145em;
	}

	.input input::placeholder, .input textarea::placeholder
	{
		color: rgb(173, 173, 194);
	}

	.button
	{
		cursor: pointer;
		max-width: 15em;
		border-width: 0.145em;
		font-family: Satoshi-Variable;
		font-weight: 475;
		line-height: 1.5em;
		border-radius: 1.5em;
		width: 100%;
		min-height: 4em;
		padding: 0.5em 1em;
		transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, color 0.2s ease-in-out;
		margin-top: 1em;
		background-color: rgb(122, 243, 191);
		border-color: rgb(86, 200, 162);
		color: rgb(27, 82, 78);
	}

	.button:hover
	{
		background-color: rgb(110, 231, 186);
	}

	.disabled
	{
		pointer-events: none;
		background-color: rgb(240, 240, 247);
		border-style: dashed;
		border-color: rgb(211, 212, 232);
		color: rgb(155, 155, 183);
	}
</style>
