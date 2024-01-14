<script lang="ts">
	import { Providers } from '$lib/providers/common';
	import { userConfigStore } from '$lib/stores';
	import { ListBox, ListBoxItem, TabGroup, Tab } from '@skeletonlabs/skeleton';

	let tab = 0;
</script>

<h2 class="h2">Settings</h2>

<TabGroup regionPanel="flex flex-col gap-2">
	<Tab bind:group={tab} name="fancy" value={0}>Fancy</Tab>
	<Tab bind:group={tab} name="json" value={1}>JSON</Tab>
	<!-- Tab Panels --->
	<svelte:fragment slot="panel">
		{#if tab === 0}
			<div class="card p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
				<div>
					<h3 class="font-bold">Providers</h3>
					<p class="text-sm opacity-75">The providers ModDB should fetch mods from</p>
				</div>

				<div class="flex gap-2 items-center justify-end">
					<ListBox multiple active="variant-soft-primary" padding="py-2 pl-4 pr-16">
						{#each Object.values(Providers) as provider}
							<ListBoxItem bind:group={$userConfigStore.providers} name="providers" value={provider}>
								{provider}
							</ListBoxItem>
						{/each}
					</ListBox>
				</div>
			</div>

			<div class="card p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
				<div>
					<h3 class="font-bold">Max results per "page"</h3>
					<p class="text-sm opacity-75">Scrolling to the bottom will load more</p>
				</div>

				<div class="flex gap-2 items-center justify-end">
					<select bind:value={$userConfigStore.limit} class="select w-fit">
						{#each [5, 10, 25, 50, 75, 100] as limit}
							<option value={limit}>{limit}</option>
						{/each}
					</select>
					* {$userConfigStore.providers.length} providers = {$userConfigStore.limit *
						$userConfigStore.providers.length} results
				</div>
			</div>
		{:else if tab === 1}
			<textarea
				class="textarea"
				rows="16"
				value={JSON.stringify($userConfigStore, undefined, 2)}
				on:change={(e) => {
					// @ts-expect-error
					$userConfigStore = JSON.parse(e.target?.value);
				}}
			/>
		{/if}
	</svelte:fragment>
</TabGroup>
