<!-- TODO: This entire page is a mess. I appologize for whoever has to read this code. <3 -->

<script lang="ts">
	import { convertToArray, handleError } from '$lib/common';
	import { getProvider, Providers, type Mod } from '$lib/providers/common';
	import { userConfigStore } from '$lib/stores';
	import * as Avatar from '$ui/avatar';
	import * as Card from '$ui/card';
	import { toast } from 'svelte-sonner';
	import { Skeleton } from '$ui/skeleton';
	import { base } from '$app/paths';
	import * as Alert from '$ui/alert';
	import { DownloadCloud } from 'lucide-svelte';

	export let offset = 0;
	export let query = '';

	/* --- */

	let mods: {
		[provider: string]: {
			mods: Mod[];
			count: number;
		};
	} = {};
	let resolved = false;
	let failed = false;

	$: toast.promise(
		Promise.all(
			Object.values($userConfigStore.providers).map((provider) => {
				if (!Object.values(Providers).includes(provider))
					return toast.error(`Rejected unknown provider: ${provider}`);

				mods[provider] = { mods: [], count: 0 };
				return getProvider(provider)
					.getMods({
						query,
						offset: (+offset - 1) * $userConfigStore.search.limit,
						...$userConfigStore.search
					})
					.then((d) => {
						mods[provider].mods = d.mods;
						mods[provider].count = d.count;
						resolved = true;
					})
					.catch((e) => {
						handleError('Provider ' + provider + ' encountered an error: ' + e);
						failed = true;
					});
			})
		),
		{
			loading: 'Fetching data from providers...'
		}
	);

	$: flatMods = (() => {
		const arrays = Object.values(mods).map((m) => m.mods);

		const result = [];
		const maxLength = Math.max(...arrays.map((arr) => arr.length));

		for (let i = 0; i < maxLength; i++) {
			for (const array of arrays) {
				if (i < array.length) {
					result.push(array[i]);
				}
			}
		}

		return result;
	})();

	$: combinedMods = resolved
		? flatMods.reduce((acc: Mod[], mod) => {
				const existingMod = acc.find((m) => m.name === mod.name && m.slug === mod.slug);
				if (existingMod) {
					existingMod.downloads += mod.downloads;
					existingMod.moddbSource = convertToArray(existingMod.moddbSource).concat(mod.moddbSource);
				} else acc.push(mod);
				return acc;
		  }, [])
		: [];

	export let count = 0;
	$: count = Object.values(mods).reduce((a, b) => a + b.count, 0);

	export let visibleCount = 0;
	$: visibleCount = combinedMods.length;

	$: console.dir(combinedMods);
</script>

{#if failed}
	<Card.Root class="flex gap-2 p-4 items-center">
		<DownloadCloud />
		<p>ModDB could not fetch any data from one or more providers.</p>
	</Card.Root>
{/if}

{#each combinedMods as mod, i}
	<a href="{base}/p/{mod.slug}">
		<Card.Root class="generic-button">
			<Card.Content class="p-3 flex gap-2">
				<Avatar.Root class="w-12 h-12 rounded-sm">
					<Avatar.Image src={mod.icon} alt="{mod.name} icon" />
					<Avatar.Fallback>{mod.name}</Avatar.Fallback>
				</Avatar.Root>

				<div>
					<h3>{mod.name}</h3>
					<p>{mod.description}</p>

					<p class="text-sm text-muted-foreground">
						{mod.downloads} downloads, {mod.watches} watching, slug {mod.slug}, served by {mod.moddbSource}
					</p>
				</div>
			</Card.Content>
		</Card.Root>
	</a>
{:else}
	<!-- {#if !resolved}
		<Skeleton class="w-full h-20 rounded" />
		<Skeleton class="w-full h-20 rounded" />
		<Skeleton class="w-full h-20 rounded" />
		<Skeleton class="w-full h-20 rounded" />
		<Skeleton class="w-full h-20 rounded" />
		<Skeleton class="w-full h-20 rounded" />
		<Skeleton class="w-full h-20 rounded" />
		<Skeleton class="w-full h-20 rounded" />
		<Skeleton class="w-full h-20 rounded" />
		<Skeleton class="w-full h-20 rounded" />
		<Skeleton class="w-full h-20 rounded" />
		<Skeleton class="w-full h-20 rounded" />
		<Skeleton class="w-full h-20 rounded" />
		<Skeleton class="w-full h-20 rounded" />
		<Skeleton class="w-full h-20 rounded" />
	{:else} -->
	<p class="text-sm text-muted-foreground ml-2">(no more results)</p>
{/each}
