<script lang="ts">
	import { Label } from '$lib/types';
	import Title from '$lib/svgs/title.svg';
	import Background from '$lib/home/background.svelte';
	import type { PageProps } from './$types';
	import Logo from '$lib/svgs/logo.svg';

	let { data }: PageProps = $props();

	const map_list = $derived(Object.values(data.maps).flatMap((map) => map.maps));
	let width = $state(0);
	let height = $state(0);
	let placeholder: string | undefined = $state(undefined);

	function get_placeholder()
	{
		let new_placeholder = map_list[Math.floor(Math.random() * map_list.length)].name;

		while (new_placeholder === placeholder)
			new_placeholder = map_list[Math.floor(Math.random() * map_list.length)].name;

		placeholder = new_placeholder;
	}

	get_placeholder();
	setInterval(get_placeholder, 2000);

	async function request(): Promise<void>
	{
		const response = await fetch(`/request`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				username: 'angeluriot',
				contact: 'test contact',
				comment: 'test comment',
				type: Label.OtherRequest
			}),
		});

		if (!response.ok)
		{
			console.error('Failed to request:', response.statusText);
			return;
		}

		const result = await response.json() as { issue_url: string };
		console.log('Request successful:', result.issue_url);
	}
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height}/>

<svelte:head>
	<title>Papermap</title>
	<meta name="description" content="Papermap"/>
	<meta name="description" content={map.description}/>
	<meta name="keywords" content={tags.join(', ')}/>
	<meta name="subject" content={map.group.name}/>
	<meta name="topic" content={map.group.name}/>
	<meta name="summary" content={map.description}/>
	<meta name="url" content={page_url}/>
	<meta name="pagename" content={map.question.short}/>

	<meta property="og:title" content={map.question.short}/>
	<meta property="og:url" content={page_url}/>
	<meta property="og:image" content={image_url}/>
	<meta property="og:image:url" content={image_url}/>
	<meta property="og:image:secure_url" content={image_url}/>
	<meta property="og:image:width" content=968/>
	<meta property="og:image:height" content=936/>
	<meta property="og:description" content={map.description}/>
	<meta property="article:tag" content={tags.join(', ')}/>

	<meta name="twitter:title" content={map.question.short}/>
	<meta name="twitter:description" content={map.description}/>
	<meta name="twitter:image" content={image_url}/>
	<meta name="twitter:image:src" content={image_url}/>
	<meta name="twitter:image:alt" content={map.question.short}/>
	<meta name="twitter:url" content={page_url}/>
</svelte:head>

<div class="page-container">
	<div class="absolute z-10 left-0 top-0 w-full h-full overflow-hidden flex-center-col gap-[4em]">
		<div class="title flex-center-row unselectable">
			<img src={Logo} alt="Logo" class="logo"/>
			<img src={Title} alt="Papermap" class="title-text"/>
		</div>
		<input type="text" placeholder="{placeholder}" class="rounded-full bg-white mb-[9em]">
	</div>
	<div class="absolute left-0 top-0 w-full h-full overflow-hidden unselectable">
		<Background {width} {height}/>
	</div>
</div>

<style>
	.page-container
	{
		font-size: clamp(11px, calc(calc(0.15vw + 5px) * 2), 16px);
	}

	.title
	{
		font-size: max(min(4.5em, 12vw), 30px);
		gap: 0.45em;
	}

	.logo
	{
		width: 1.15em;
	}

	.title-text
	{
		width: 4.4em;
		margin-bottom: -0.25em;
	}

	input
	{
		width: 50em;
		max-width: calc(100vw - 4em);
		padding: 1em 1.5em;
		font-family: Satoshi-Variable;
		font-weight: 550;
		line-height: 1.5em;
		letter-spacing: 0.005em;
		box-shadow: 0em 0.2em 4em #00008040;
	}
</style>
