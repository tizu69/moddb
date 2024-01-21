<script lang="ts">
	import { page } from '$app/stores';
	import consts from '$lib/consts';
	import { mediaQuery } from 'svelte-legos';

	const mobile = mediaQuery('(max-width: 1280px)');
</script>

{#if consts.SIDEBAR_PATHS.includes($page.route.id ?? '')}
	{#if $mobile}
		<aside class="flex flex-col gap-2">
			<slot name="sidebarTop" />
		</aside>
	{:else}
		<aside class="flex flex-col gap-2">
			<slot name="sidebarTop" />
			<slot name="sidebarBottom" />
		</aside>
	{/if}

	<main class="flex flex-col gap-2">
		<slot />
	</main>

	{#if $mobile}
		<aside class="flex flex-col gap-2">
			<slot name="sidebarBottom" />
		</aside>
	{/if}
{:else}
	<slot />
{/if}
