<script lang="ts">
	import { markdown } from '$lib/common';
	import type { ModMember, ModProject, ModVersion } from '$lib/providers/common';
	import * as Card from '$ui/card';
	import * as Tabs from '$ui/tabs';
	import { partial_ratio } from 'fuzzball';
	import moment from 'moment';
	import * as DropdownMenu from '$ui/dropdown-menu';
	import { Input } from '$ui/input';
	import { Button } from '$ui/button';
	import { Badge } from '$ui/badge';

	export let mod: ModProject & {
		_versions?: ModVersion[];
		_members?: ModMember[];
	};
	export let tab = 'readme';

	$: readme = markdown(mod.longDescription);

	let _versSearch = '';
</script>

<!-- use your editors folding mechanism for easier navigation! -->

<Tabs.Content value="readme">
	<Card.Root>
		<Card.Content class="overflow-y-clip">
			<div class="style-markdown flex select-text flex-col gap-1 items-start *:select-text">
				{@html readme}
			</div>
		</Card.Content>
	</Card.Root>
</Tabs.Content>

<Tabs.Content value="pics">
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
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

					<p class="text-sm text-muted-foreground">{moment(img.timestamp).fromNow()}</p>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>
</Tabs.Content>

<Tabs.Content value="raw">
	<pre>{JSON.stringify(
			(() => {
				let obj = { ...mod };
				obj.longDescription = obj.longDescription.substring(0, 80) + '...';
				return obj;
			})(),
			undefined,
			2
		)}</pre>
</Tabs.Content>

<Tabs.Content value="vers">
	<h1 class="text-2xl">This page does not work yet!</h1>

	{#if mod._versions}
		{@const filteredVers = mod._versions}

		<Card.Root>
			<Card.Content>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<Input placeholder="Search by name" bind:value={_versSearch} />
					</DropdownMenu.Trigger>

					<DropdownMenu.Content class="w-64">
						<DropdownMenu.Item>list</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>

				<p class="text-sm text-muted-foreground">
					Type @ to show a list of filters &bull; {filteredVers.length} results visible
				</p>
			</Card.Content>
		</Card.Root>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-2">
			{#each filteredVers as v, i}
				<div class="rounded bg-background py-1 px-2 border">
					{v.name}
				</div>
			{/each}
		</div>
	{/if}
</Tabs.Content>
