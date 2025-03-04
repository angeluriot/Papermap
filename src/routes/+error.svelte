<script lang="ts">
	import { redirect } from '@sveltejs/kit';
	import { constants as C } from '$lib/utils';

	if (C.PROD)
		redirect(307, '/');
</script>

<div>404</div>

<style>
</style>
