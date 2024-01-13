<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { Input } from '$lib/components/ui/input';
	import { Separator } from './ui/separator';
	import { goto } from '$app/navigation';
	import { searchQueryStore } from '$lib/stores';

	const paths: { name: string; href: string; urlId?: string }[] = [{ name: 'Home', href: '/' }];

	let searchedFor = $searchQueryStore;
</script>

<header class="border-b px-auto py-3 sticky top-0 backdrop-blur-md vtn-[header]">
	<div class="flex items-center gap-4 container">
		<a href="{base}/" class="hover:brightness-90">
			<img src="{base}/favicon.png" alt="ModDB icon" class="h-6 w-auto min-w-[auto]" />
		</a>

		<Separator orientation="vertical" class="h-4" />

		<nav class="flex items-center gap-4">
			{#each paths as path}
				<a
					href="{base}{path.href}"
					class="text-sm font-medium transition-colors hover:text-primary"
					class:text-muted-foreground={$page.route.id != (path.urlId ?? path.href)}
				>
					{path.name}
				</a>
			{/each}
		</nav>

		<div class="mx-auto" />

		<Input
			type="search"
			placeholder="Search ModDB..."
			class="transition-[width] duration-700 {$page.route.id == '/s' ? 'w-[calc(100%-12rem)]' : 'w-48 md:w-64'}"
			bind:value={searchedFor}
			on:focus={() => goto(`${base}/s?q=${encodeURIComponent(searchedFor)}`, { keepFocus: true })}
			on:change={() => goto(`${base}/s?q=${encodeURIComponent(searchedFor)}`)}
			on:input={() => ($searchQueryStore = searchedFor)}
		/>
	</div>
</header>
