<script lang="ts">
	import { page } from '$app/stores';
	import { parseInputString } from '$lib/argparse';
	import { Providers, type Mod, getProvider } from '$lib/providers/common';
	import { searchQueryStore, userConfigStore } from '$lib/stores';
	import { Avatar, ProgressRadial } from '@skeletonlabs/skeleton';
	import ScrollChecker from '$lib/components/ScrollChecker.svelte';
	import { convertToArray } from '$lib/common';

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
		rootParamTimeout: NodeJS.Timeout;
	$: if (rootParam != queryParams.ROOT) {
		clearTimeout(rootParamTimeout);
		rootParamTimeout = setTimeout(() => (rootParam = queryParams.ROOT), 700);
	}

	/* --- */

	let mods: {
		[provider: string]: {
			mods: Mod[];
			count: number;
		};
	} = {};
	$: Object.values($userConfigStore.providers).forEach((provider) => {
		getProvider(provider)
			.getMods(rootParam, $userConfigStore.limit)
			.then((d) => (mods[provider] = d));
	});

	$: combinedMods = Object.values(mods)
		.flatMap((d) => d.mods)
		.sort((b, a) => a.downloads - b.downloads)
		// combine mods with the same name and slug
		.reduce((acc: Mod[], mod) => {
			const existingMod = acc.find((m) => m.name === mod.name && m.slug === mod.slug);
			if (existingMod) {
				existingMod.downloads += mod.downloads;
				existingMod.moddbSource = convertToArray(existingMod.moddbSource).concat(mod.moddbSource);
			} else acc.push(mod);
			return acc;
		}, []);
</script>

<svelte:head>
	<title>{queryParams.ROOT || 'Search'} - ModDB</title>
</svelte:head>

Searching for {queryParams.ROOT} of type {searchType} - {Object.values(mods).reduce((a, b) => a + b.count, 0)} results ({combinedMods.length}
visible)

{#if combinedMods.length != 0}
	{#each combinedMods as mod, i}
		{#if typeof mod == 'object'}
			<a
				class="card card-hover bg-surface-backdrop-token hover:bg-surface-hover-token flex gap-2 p-2"
				href="/p/{mod.slug}"
			>
				<Avatar
					src={mod.icon}
					alt="{mod.name} icon"
					initials={mod.name}
					rounded="rounded-lg"
					width="w-12 h-12"
					background=""
				/>

				<div>
					<h3 class="h3">{mod.name}</h3>
					<p>{mod.description}</p>

					<p class="text-sm opacity-75">
						{mod.downloads} downloads, {mod.watches} watching, slug {mod.slug}, served by {mod.moddbSource}
					</p>
				</div>
			</a>
		{:else if typeof mod == 'number' && i != 0}
			<hr />
		{/if}
	{/each}
	<ScrollChecker
		on:change={({ detail }) => {
			if (!detail.visible || combinedMods.length == 0) return;
			console.info('Loading more -> ' + combinedMods.length);
			Object.values($userConfigStore.providers).forEach((provider) => {
				getProvider(provider)
					.getMods(rootParam, $userConfigStore.limit, provider in mods ? mods[provider].mods.length : 0)
					.then((d) => {
						mods[provider].mods = mods[provider].mods.concat(d.mods);
						mods[provider].count = d.count;
					});
			});
		}}
		let:visible
	>
		{#if visible && combinedMods.length > 0}
			<ProgressRadial
				stroke={60}
				meter="stroke-primary-500"
				track="stroke-primary-500/5"
				width="w-12 mx-auto"
				strokeLinecap="round"
			/>
		{:else if visible && combinedMods.length == 0}
			<p>No more results :(</p>
		{/if}
	</ScrollChecker>
{:else}
	<p>No results :(</p>
{/if}
