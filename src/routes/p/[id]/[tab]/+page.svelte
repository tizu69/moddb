<script lang="ts">
	import { formatNumber, getS } from '$lib/common';
	import SidebarHelper from '$lib/components/SidebarHelper.svelte';
	import type { Providers } from '$lib/providers/common';
	import { sttDataStore } from '$lib/stores';
	import * as Avatar from '$ui/avatar';
	import { Badge } from '$ui/badge';
	import * as Card from '$ui/card';
	import * as DropdownMenu from '$ui/dropdown-menu';
	import * as Tabs from '$ui/tabs';
	import {
		BookOpen,
		BookUp2,
		Bug,
		Code2,
		Coins,
		Download,
		ExternalLink,
		Eye,
		GitFork,
		MessageCircle,
		PackagePlus,
		Rocket,
		Scale,
		Signpost,
		Image,
		History,
		ChevronsUpDown,
		Building2
	} from 'lucide-svelte';
	import moment from 'moment';
	import { mediaQuery } from 'svelte-legos';
	import type { PageData } from './$types';
	import Porject from './Porject.svelte';
	import ProviderPicker from './ProviderPicker.svelte';
	import StatButton from './StatButton.svelte';
	import StatItem from './StatItem.svelte';
	import * as Collapsible from '$ui/collapsible';
	import { Button } from '$ui/button';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { Separator } from '$ui/separator';

	export let data: PageData;

	let mods = data.mods;
	let provider = data.provider as unknown as Providers;

	let tab = 'readme';

	$: $sttDataStore = `${provider ? mods[provider]?.name : 'Mod'} @ ${provider ?? 'no one'}`;

	const providerPickerInSidebar = mediaQuery('(max-width: 768px)');

	$: goto(`${base}/p/${$page.params.id}/${tab}`);
</script>

{#if provider}
	{@const mod = mods[provider]}

	{#if mod}
		<SidebarHelper>
			<Tabs.Root bind:value={tab}>
				<div class="flex justify-between">
					<Tabs.List>
						<Tabs.Trigger value="readme">
							<BookOpen class="w-4 h-4 mr-1" />
							Description
						</Tabs.Trigger>

						<Tabs.Trigger value="pics" disabled={mod.gallery?.length == 0}>
							<Image class="w-4 h-4 mr-1" />
							Gallery
						</Tabs.Trigger>

						<Tabs.Trigger value="vers" disabled={!mod._versions}>
							<History class="w-4 h-4 mr-1" />
							Versions
							<Badge class="ml-2" variant="destructive">Beta</Badge>
						</Tabs.Trigger>

						<Tabs.Trigger value="raw">raw</Tabs.Trigger>
					</Tabs.List>

					{#if !$providerPickerInSidebar}
						<ProviderPicker bind:provider {mod} {mods} />
					{/if}
				</div>

				<Porject {mod} {tab} />
			</Tabs.Root>

			<svelte:fragment slot="sidebarTop">
				<Card.Root>
					{#if mod.gallery?.length > 0}
						<img
							src={mod.gallery[0].url}
							alt="gallery"
							class="w-full h-full object-cover brightness-75 max-h-32 rounded-t-lg"
						/>
					{/if}

					<Card.Content class="space-y-2 {mod.gallery?.length > 0 ? '-mt-14' : ''}">
						<Avatar.Root class="w-16 h-16 rounded ring-border ring-4 bg-border">
							<Avatar.Image src={mod.icon} alt="{mod.name} icon" />
							<Avatar.Fallback>{mod.name}</Avatar.Fallback>
						</Avatar.Root>

						<div>
							<h3 class="text-xl">{mod.name}</h3>
							<p class="text-sm text-muted-foreground">{mod.description}</p>
						</div>

						{#if $providerPickerInSidebar}
							<ProviderPicker bind:provider {mod} {mods} variant="outline" />
						{/if}

						<Separator />
						<Collapsible.Root>
							<div class="flex items-center justify-between">
								<p class="text-sm text-muted-foreground">
									{mod._members.length} member{getS(mod._members.length)}
								</p>
								<Collapsible.Trigger asChild let:builder>
									<Button builders={[builder]} variant="outline" size="sm" class="w-9 p-0">
										<ChevronsUpDown class="h-4 w-4" />
									</Button>
								</Collapsible.Trigger>
							</div>

							<Collapsible.Content class="space-y-2 mt-2">
								{#each mod._members as member}
									<!-- TODO: author page, <a> -->
									<div class="flex items-center gap-2">
										<Avatar.Root class="w-12 h-12 rounded">
											<Avatar.Image src={member.avatar} alt="{member.name} icon" />
											<Avatar.Fallback>{member.name}</Avatar.Fallback>
										</Avatar.Root>

										<div>
											<p class="font-bold">
												{member.name ?? member.username}
											</p>
											<p class="text-sm text-muted-foreground flex items-center gap-1">
												{#if member.orga}
													<Building2 class="w-4 h-4" />
												{/if}
												{member.role}
											</p>
										</div>
									</div>
								{/each}
							</Collapsible.Content>
						</Collapsible.Root>
					</Card.Content>
				</Card.Root>
			</svelte:fragment>

			<svelte:fragment slot="sidebarBottom">
				<Card.Root>
					<Card.Content class="space-y-2">
						<StatItem icon={Download} stat={formatNumber(mod.downloads)} sub="downloads" />
						<StatItem icon={Eye} stat={formatNumber(mod.watches ?? 0)} sub="watches" />

						<StatItem icon={BookUp2} stat={moment(mod.dates.updated).fromNow()} sub="last update" />
						<StatItem icon={PackagePlus} stat={moment(mod.dates.created).fromNow()} sub="created" />

						{#if mod.info.license.name}
							<StatItem icon={Scale} stat={mod.info.license.name} sub="license" />
						{/if}

						<StatItem icon={Signpost} stat={mod.id} sub="mod identifier" />

						{#if mod.info.versions}
							<StatItem
								icon={GitFork}
								stat={mod.info.versions.at(-1) + ' (+ ' + (mod.info.versions.length - 1) + ')'}
								sub="game version"
							/>
						{/if}
						{#if mod.info.loaders}
							<StatItem
								icon={Rocket}
								stat={mod.info.loaders.map((l) => l.substring(0, 3)).join(', ')}
								sub="loaders"
							/>
						{/if}
					</Card.Content>
				</Card.Root>

				<div class="space-y-2 pl-4">
					{#if mod.links.discord}
						<StatButton href={mod.links.discord} icon={MessageCircle} title="Join our Discord" />
					{/if}

					{#if mod.links.issues}
						<StatButton href={mod.links.issues} icon={Bug} title="Report issues" />
					{/if}

					{#if mod.links.wiki}
						<StatButton href={mod.links.wiki} icon={BookOpen} title="Documentation" />
					{/if}

					{#if mod.links.source}
						<StatButton href={mod.links.source} icon={Code2} title="Source code" />
					{/if}

					{#if mod.links.donations && mod.links.donations.length > 0}
						<DropdownMenu.Root>
							<DropdownMenu.Trigger asChild let:builder>
								<StatButton builders={[builder]} icon={Coins} title="Donate" />
							</DropdownMenu.Trigger>

							<DropdownMenu.Content class="w-64">
								<DropdownMenu.Label>Thank you for your support!</DropdownMenu.Label>

								<DropdownMenu.Separator />

								{#each mod.links.donations as d}
									<DropdownMenu.Item href={d.url} target="_blank">
										{d.name}
									</DropdownMenu.Item>
								{/each}
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					{/if}

					<StatButton href={mod.sourceUrl} icon={ExternalLink} title="Open in {mod.moddbSource}" />
				</div>
			</svelte:fragment>
		</SidebarHelper>
	{/if}
{/if}
