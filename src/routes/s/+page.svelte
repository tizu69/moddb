<script lang="ts">
	import { page } from '$app/stores';
	import { parseInputString } from '$lib/argparse';
	import { searchQueryStore, singletonStore } from '$lib/stores';
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '$lib/components/ui/avatar';

	$: $searchQueryStore = $page.url.searchParams.get('q') ?? '';

	$: queryParams = parseInputString($searchQueryStore);
	$: searchType = (() => {
		switch (queryParams.type) {
			case 'mod':
			case undefined:
				return 'mod';
			case 'plugin':
				return 'plugin';
			default:
				return '?';
		}
	})();

	let rootParam = queryParams ? queryParams.ROOT : '',
		rootParamTimeout: number;
	$: if (rootParam != queryParams.ROOT) {
		clearTimeout(rootParamTimeout);
		rootParamTimeout = setTimeout(() => (rootParam = queryParams.ROOT), 700);
	}
</script>

<svelte:head>
	<title>{queryParams.ROOT || 'Search'} - ModDB</title>
</svelte:head>

Searching for {queryParams.ROOT} of type {searchType}

{#await $singletonStore.getMods(rootParam) then d}
	{@const data = d.flat()}
	{#each data as mod}
		<Card.Root class="flex gap-2 p-4">
			<Avatar.Root>
				<Avatar.Image src={mod.icon} alt="{mod.name} icon" />
				<Avatar.Fallback>{mod.name[0]}{mod.name[1]}</Avatar.Fallback>
			</Avatar.Root>

			<div>
				<Card.Title tag="h3">{mod.name}</Card.Title>
				<Card.Description>{mod.description}</Card.Description>
				<p class="text-sm text-muted-foreground">
					{mod.downloads} downloads, slug {mod.slug}
				</p>
			</div>
		</Card.Root>
		<p>{JSON.stringify(mod)}</p>
	{/each}
{:catch error}
	{error}
{/await}
