<script lang="ts">
	import { page } from '$app/stores';
	import { handleError } from '$lib/common';
	import type { ModProject } from '$lib/providers/common';
	import { Providers, getProvider } from '$lib/providers/common';
	import { sttDataStore, userConfigStore } from '$lib/stores';
	import { Button } from '$ui/button';
	import * as DropdownMenu from '$ui/dropdown-menu';
	import * as Avatar from '$ui/avatar';
	import { ChevronDown, ExternalLink } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import Porject from './Porject.svelte';

	let mods: {
		[provider in Providers]?: ModProject;
	} = {};
	let allResolved = false;

	Promise.all(
		Object.values($userConfigStore.providers).map((p) => {
			if (!Object.values(Providers).includes(p)) return toast.error(`Rejected unknown provider: ${p}`);

			return getProvider(p)
				.getMod({
					id: $page.params.id
				})
				.then((d) => {
					mods[p] = d;
					provider ??= p;
				})
				.catch(handleError);
		})
	).then(() => (allResolved = true));

	let provider: Providers | undefined = undefined;

	$: $sttDataStore = `${provider ? mods[provider]?.name : 'Mod'} @ ${provider ?? 'no one'}`;
</script>

{#if provider}
	{@const mod = mods[provider]}
	<div class="flex gap-1 justify-between items-center">
		<div class="flex gap-2 items-center">
			<Avatar.Root class="w-8 h-8 rounded-none">
				<Avatar.Image src={mod?.icon} alt="{mod?.name} icon" />
				<Avatar.Fallback>{mod?.name}</Avatar.Fallback>
			</Avatar.Root>

			<div>
				<h3 class="text-xl">{mod?.name}</h3>
				<p>{mod?.description}</p>
			</div>
		</div>

		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<Button variant="outline" builders={[builder]} disabled={!allResolved}>
					Provided by {provider ?? 'no one'}
					<ChevronDown class="w-4 h-4 ml-2" />
				</Button>
			</DropdownMenu.Trigger>

			<DropdownMenu.Content class="w-64">
				<DropdownMenu.Item href={mod?.sourceUrl} target="_blank">
					<ExternalLink class="mr-2 h-4 w-4" />
					<span>Open in {provider}</span>
				</DropdownMenu.Item>

				{#if Object.keys(mods).length > 1}
					<DropdownMenu.Separator />
					<DropdownMenu.Label>Also available from</DropdownMenu.Label>

					<DropdownMenu.RadioGroup bind:value={provider}>
						{#each Object.keys(mods)
							.sort((a, b) => {
								// @ts-ignore
								return $userConfigStore.providers.indexOf(a) - $userConfigStore.providers.indexOf(b);
							})
							.filter((s) => s != provider) as s}
							<DropdownMenu.RadioItem value={s}>{s}</DropdownMenu.RadioItem>
						{/each}
					</DropdownMenu.RadioGroup>
				{/if}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>

	{#if mod}
		<Porject project={mod} />
	{/if}

	<pre class="text-wrap">{JSON.stringify(mods, null, 2)}</pre>
{/if}
