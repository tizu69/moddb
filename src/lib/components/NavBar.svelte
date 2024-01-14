<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { searchQueryStore } from '$lib/stores';
	import { IconSettings } from '@tabler/icons-svelte';

	const paths: { name: string; href: string; urlId?: string }[] = [{ name: 'Home', href: '/' }];

	let searchedFor = $searchQueryStore;
</script>

<header class="py-3 sticky top-0 backdrop-blur-md vtn-[header] z-[999]">
	<div class="flex items-center gap-4 container mx-auto">
		<a href="{base}/" class="hover:brightness-90">
			<img src="{base}/favicon.png" alt="ModDB icon" class="h-6 w-auto min-w-[auto]" />
		</a>

		<div class="divider-vertical mx-0 h-4" />

		<nav class="flex items-center gap-4">
			{#each paths as path}
				<a
					href="{base}{path.href}"
					class="text-sm font-medium transition-colors hover:text-primary-400"
					class:text-surface-300={$page.route.id != (path.urlId ?? path.href)}
				>
					{path.name}
				</a>
			{/each}
		</nav>

		<div class="mx-auto" />

		<input
			type="search"
			placeholder="Search ModDB..."
			class="input !bg-surface-700 transition-[width] duration-700 {$page.route.id == '/s'
				? 'w-[calc(100%-12rem)]'
				: 'w-48 md:w-64'}"
			bind:value={searchedFor}
			on:focus={() => goto(`${base}/s?q=${encodeURIComponent(searchedFor)}`, { keepFocus: true })}
			on:change={() => goto(`${base}/s?q=${encodeURIComponent(searchedFor)}`)}
			on:input={() => ($searchQueryStore = searchedFor)}
		/>

		<a class="btn-icon" href="{base}/settings">
			<IconSettings />
		</a>
	</div>
</header>
