<script lang="ts">
	import { page } from '$app/stores';
	import { parseInputString } from '$lib/argparse';
	import { searchQueryStore, sttDataStore, userConfigStore } from '$lib/stores';
	import { Button } from '$ui/button';
	import { Separator } from '$ui/separator';
	import * as Tooltip from '$ui/tooltip';
	import SearchPreview from './SearchPreview.svelte';

	$: $searchQueryStore = $page.url.searchParams.get('q') ?? '';

	let queryParams = parseInputString($page.url.searchParams.get('q') ?? '');
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

	$: offset = +(queryParams.p ?? 1);

	let query = queryParams.ROOT ?? '',
		queryTimeout: ReturnType<typeof setTimeout>;
	$: {
		if (queryTimeout) clearTimeout(queryTimeout);
		queryTimeout = setTimeout(() => {
			query = queryParams.ROOT ?? '';
			scrollResults = 1;
		}, 700);
	}

	let scrollResults = 1;

	let count: number[] = [];

	let visibleCount: number[] = [];
	$: totalVisibleCount = visibleCount.reduce((a, b) => a + b, 0);

	$: $sttDataStore = `${totalVisibleCount} results visible`;
</script>

<svelte:head>
	<title>{queryParams.ROOT || 'Search'} - ModDB</title>
</svelte:head>

<!-- Searching for {queryParams.ROOT} of type {searchType} - {Object.values(mods).reduce((a, b) => a + b.count, 0)} results ({flatMods.length}
visible) -->

<div class="flex gap-1 ml-auto">
	<!-- <DropdownMenu.Root>
		<DropdownMenu.Trigger asChild let:builder>
			<Button variant="outline" builders={[builder]}>
				Sort by {$userConfigStore.search.sort}
				<ChevronDown class="w-4 h-4 ml-1" />
			</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="w-64">
			<DropdownMenu.Label class="pb-0">Change sorting method</DropdownMenu.Label>
			<DropdownMenu.Label class="font-normal pt-0">
				Note: This will clear currently loaded results!
			</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<DropdownMenu.RadioGroup bind:value={$userConfigStore.search.sort}>
				{#each ['relevance', 'downloads', 'watches'] as s}
					<DropdownMenu.RadioItem value={s}>{s}</DropdownMenu.RadioItem>
				{/each}
			</DropdownMenu.RadioGroup>
		</DropdownMenu.Content>
	</DropdownMenu.Root> -->
</div>

{#each Array(scrollResults) as _, i (i)}
	<Separator class={i == 0 ? 'hidden' : ''} />
	<SearchPreview {query} offset={offset + i} bind:count={count[i]} bind:visibleCount={visibleCount[i]} />
{/each}

<!-- <ScrollChecker
	on:change={({ detail }) => {
		if (!detail || !$userConfigStore.search.autoPaginate) return;
		if (count[0] < 1 || paginationTimeout) return;

		// FIXME: I feel like this ain't working as intended
		paginationTimeout = setTimeout(() => {
			paginationTimeout = undefined;
		}, 500);

		scrollResults += 1;
	}}
> -->
<div class="flex justify-center gap-1">
	<Button on:click={() => (scrollResults += 1)}>Load more</Button>

	{#each [2, 5, 10] as i}
		<Tooltip.Root>
			<Tooltip.Trigger>
				<Button variant="outline" on:click={() => (scrollResults += i)}>x{i}</Button>
			</Tooltip.Trigger>
			<Tooltip.Content>
				Load up to {i * $userConfigStore.search.limit} results
			</Tooltip.Content>
		</Tooltip.Root>
	{/each}
</div>
