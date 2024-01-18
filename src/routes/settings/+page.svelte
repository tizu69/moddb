<script lang="ts">
	import { moveItem } from '$lib/common';
	import { Providers } from '$lib/providers/common';
	import { userConfigStore } from '$lib/stores';
	import { Button } from '$ui/button';
	import * as Card from '$ui/card';
	import Checkbox from '$ui/checkbox/checkbox.svelte';
	import * as Dialog from '$ui/dialog';
	import { Input } from '$ui/input';
	import { Separator } from '$ui/separator';
	import * as Tabs from '$ui/tabs';
	import { Textarea } from '$ui/textarea';
	import { ChevronDown, ChevronUp, Edit } from 'lucide-svelte';
	import { flip } from 'svelte/animate';
</script>

<h2>Settings (file v{$userConfigStore.v})</h2>

<Tabs.Root>
	<Tabs.List>
		<Tabs.Trigger value="fancy">Fancy</Tabs.Trigger>
		<Tabs.Trigger value="json">JSON</Tabs.Trigger>
	</Tabs.List>

	<Tabs.Content value="fancy" class="space-y-1">
		<Card.Root>
			<Card.Content class="grid grid-cols-1 sm:grid-cols-2 gap-3">
				<div>
					<h3 class="font-bold">Providers</h3>
					<p class="text-sm text-muted-foreground">The providers ModDB should fetch mods from</p>
				</div>

				<div class="flex gap-2 items-center justify-end">
					<Dialog.Root>
						<Dialog.Trigger>
							<Button variant="secondary">
								<Edit class="mr-2 w-4 h-4" />
								{$userConfigStore.providers.length} enabled
							</Button>
						</Dialog.Trigger>
						<Dialog.Content class="gap-2">
							<Dialog.Header class="mb-2">
								<Dialog.Title>Enable and sort providers</Dialog.Title>
								<Dialog.Description>
									Mod metadata will be pulled from the first enabled provider the mod is found on and
									searches will search the providers, in descending order.
								</Dialog.Description>
							</Dialog.Header>

							{#each $userConfigStore.providers as provider, i (provider)}
								<span animate:flip={{ duration: 300 }}>
									<Card.Root class="flex justify-between items-center p-1 pl-4 group">
										{provider}

										<div
											class="opacity-0 group-hover:opacity-100 flex gap-1 transition-[opacity] duration-75"
										>
											<Button
												variant="ghost"
												size="icon"
												disabled={i == 0}
												on:click={() =>
													($userConfigStore.providers = moveItem(
														$userConfigStore.providers,
														i,
														i - 1
													))}
											>
												<ChevronUp class="w-4 h-4" />
											</Button>
											{#if i != $userConfigStore.providers.length - 1}
												<Button
													variant="ghost"
													size="icon"
													on:click={() =>
														($userConfigStore.providers = moveItem(
															$userConfigStore.providers,
															i,
															i + 1
														))}
												>
													<ChevronDown class="w-4 h-4" />
												</Button>
											{:else}
												<Button
													variant="destructive"
													size="icon"
													on:click={() =>
														($userConfigStore.providers = $userConfigStore.providers.filter(
															(p) => p != provider
														))}
												>
													<ChevronDown class="w-4 h-4" />
												</Button>
											{/if}
										</div>
									</Card.Root>
								</span>
							{:else}
								<p class="text-sm text-muted-foreground">
									No providers enabled, ModDB won't fetch mods!
								</p>
							{/each}

							<Separator />

							{#each Object.values(Providers).filter((provider) => !$userConfigStore.providers.includes(provider)) as provider, i (provider)}
								<span animate:flip={{ duration: 300 }}>
									<Card.Root class="flex justify-between items-center p-1 pl-4 group">
										{provider}

										<div
											class="opacity-0 group-hover:opacity-100 flex gap-1 transition-[opacity] duration-75"
										>
											<Button
												size="icon"
												on:click={() =>
													($userConfigStore.providers = [
														...$userConfigStore.providers,
														provider
													])}
											>
												<ChevronUp class="w-4 h-4" />
											</Button>
										</div>
									</Card.Root>
								</span>
							{:else}
								<p class="text-sm text-muted-foreground">
									All providers enabled, ModDB will fetch from all {Object.values(Providers).length}
								</p>
							{/each}
						</Dialog.Content>
					</Dialog.Root>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Content class="grid grid-cols-1 sm:grid-cols-2 gap-3">
				<div>
					<h3 class="font-bold">Max results per page</h3>
					<p class="text-sm text-muted-foreground">The maximum number of results to show per page</p>
				</div>

				<div class="flex gap-2 items-center justify-end">
					<Input bind:value={$userConfigStore.search.limit} type="number" min="1" max="100" class="w-32" />
					x {$userConfigStore.providers.length} providers = {$userConfigStore.search.limit *
						$userConfigStore.providers.length} results
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Content class="grid grid-cols-1 sm:grid-cols-2 gap-3">
				<div>
					<h3 class="font-bold">Broader sanitization for Markdown previews</h3>
					<p class="text-sm text-muted-foreground">
						If Markdown previews like mod descriptions look broken, try enabling this. Beware that this may
						cause security and privacy issues.
					</p>
				</div>

				<div class="flex gap-2 items-center justify-end">
					<Checkbox bind:checked={$userConfigStore.lessSanitize} />
				</div>
			</Card.Content>
		</Card.Root>
	</Tabs.Content>

	<Tabs.Content value="json">
		<Textarea
			rows={16}
			value={JSON.stringify($userConfigStore, undefined, 2)}
			on:change={(e) => {
				// @ts-expect-error
				$userConfigStore = JSON.parse(e.target?.value);
			}}
		/>
	</Tabs.Content>
</Tabs.Root>
