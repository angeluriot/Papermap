<script lang="ts">
	import { Label } from "$lib/types";
	import { onMount } from "svelte";
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();

	onMount(() => {
		console.log(data.maps);
	});

	async function edit()
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

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Home" />
</svelte:head>

<h1>Home TEST 10</h1>

<button onclick={() => edit()}>button</button>

<style>
</style>
