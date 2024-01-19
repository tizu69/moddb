<script lang="ts">
	import { formatNumber, markdown } from '$lib/common';
	import type { ModProject } from '$lib/providers/common';
	import * as Card from '$ui/card';
	import * as Tabs from '$ui/tabs';
	import { BookUp2, Download, Eye, PackagePlus } from 'lucide-svelte';
	import moment from 'moment';

	export let mod: ModProject;
	let tab = 'summary';

	$: readme = markdown(mod?.longDescription || '');
</script>

<!-- use your editors folding mechanism for easier navigation! -->

<Tabs.Root bind:value={tab}>
	<Tabs.List>
		<Tabs.Trigger value="summary">Summary</Tabs.Trigger>
		<Tabs.Trigger value="readme">Description</Tabs.Trigger>
		<Tabs.Trigger value="pics" disabled={mod.gallery?.length == 0}>Gallery</Tabs.Trigger>
	</Tabs.List>

	<Tabs.Content value="summary" class="space-y-1">
		<Card.Root class="generic-button">
			<Card.Content class="overflow-y-clip max-h-48 pb-0 relative">
				<button class="w-full text-left" on:click={() => (tab = 'readme')}>
					<div class="z-10 to-card from-transparent bg-gradient-to-b absolute inset-0" />
					<p class="z-20 absolute bottom-2 text-center w-full animate-bounce">Click to expand</p>
					<div class="style-markdown flex flex-col gap-1 items-start">{@html readme}</div>
				</button>
			</Card.Content>
		</Card.Root>

		<div class="grid grid-cols-2 gap-1">
			<Card.Root>
				<Card.Content class="flex gap-2 items-center">
					<Download class="w-8 h-8" />
					<div>
						<p class="font-bold">{formatNumber(mod.downloads)}</p>
						<p class="text-sm text-muted-foreground">downloads</p>
					</div>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Content class="flex gap-2 items-center">
					<Eye class="w-8 h-8" />
					<div>
						<p class="font-bold">{formatNumber(mod.watches ?? 0)}</p>
						<p class="text-sm text-muted-foreground">watching</p>
					</div>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Content class="flex gap-2 items-center">
					<BookUp2 class="w-8 h-8" />
					<div>
						<p class="font-bold">{moment(mod.dates.updated).fromNow()}</p>
						<p class="text-sm text-muted-foreground">last update</p>
					</div>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Content class="flex gap-2 items-center">
					<PackagePlus class="w-8 h-8" />
					<div>
						<p class="font-bold">{moment(mod.dates.created).fromNow()}</p>
						<p class="text-sm text-muted-foreground">created</p>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	</Tabs.Content>

	<Tabs.Content value="readme">
		<Card.Root>
			<Card.Content class="animate-[C-max-h-from-48_0.5s_ease-in] overflow-y-clip">
				<div class="style-markdown flex select-text flex-col gap-1 items-start *:select-text">
					{@html readme}
				</div>
			</Card.Content>
		</Card.Root>
	</Tabs.Content>

	<Tabs.Content value="pics">
		<div class="grid grid-cols-2 gap-1">
			{#each mod.gallery || [] as img}
				<Card.Root class="grid grid-rows-[1fr_auto]">
					<img
						src={img.url}
						alt="gallery pic"
						class="w-full h-full object-cover p-1 rounded-[calc(var(--radius)_-_1px)]"
					/>

					<Card.Content class="p-3 pt-2 pb-3 sticky bottom-0 bg-card/80 backdrop-blur">
						{#if img.title} <h3>{img.title}</h3> {/if}
						{#if img.description} <p>{img.description}</p> {/if}
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	</Tabs.Content>
</Tabs.Root>
