<script lang="ts">
	import * as DropdownMenu from '$ui/dropdown-menu';
	import { Button } from '$ui/button';
	import { Badge } from '$ui/badge';
	import { ChevronDown, ExternalLink } from 'lucide-svelte';
	import type { ModProject, Providers } from '$lib/providers/common';
	import { userConfigStore } from '$lib/stores';

	export let provider: Providers | undefined;
	export let mods: {
		[provider in Providers]?: ModProject;
	};
	export let mod: ModProject;

	export let variant: 'default' | 'link' | 'destructive' | 'outline' | 'secondary' | 'ghost' | undefined =
		'secondary';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button {variant} builders={[builder]}>
			{provider ?? '?'}
			{#if Object.keys(mods).length > 1}
				<Badge class="ml-2" variant="default">+ {Object.keys(mods).length - 1}</Badge>
			{/if}
			<ChevronDown class="w-4 h-4 ml-2" />
		</Button>
	</DropdownMenu.Trigger>

	<DropdownMenu.Content class="w-64">
		<DropdownMenu.Item href={mod.sourceUrl} target="_blank">
			<ExternalLink class="mr-2 h-4 w-4" />
			<span>Open in {provider}</span>
		</DropdownMenu.Item>

		{#if Object.keys(mods).length > 1}
			<DropdownMenu.Separator />
			<DropdownMenu.Label>Also available on</DropdownMenu.Label>

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
