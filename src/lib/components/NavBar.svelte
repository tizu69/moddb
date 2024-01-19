<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { searchQueryStore } from '$lib/stores';
	import { Button } from '$ui/button';
	import { Input } from '$ui/input';
	import { Settings } from 'lucide-svelte';

	const paths: { name: string; href: string; urlId?: string }[] = [{ name: 'Home', href: '/' }];

	$: searchedFor = $searchQueryStore;
</script>

<header class="py-3 sticky top-0 bg-background/80 backdrop-blur vtn-[header] z-50">
	<div class="flex items-center gap-4 container mx-auto">
		<a href="{base}/" class="hover:brightness-90">
			<img src="{base}/favicon.png" alt="ModDB icon" class="h-6 w-auto min-w-[auto]" />
		</a>

		<div class="divider-vertical mx-0 h-4" />

		<nav class="flex items-center gap-4">
			{#each paths as path}
				<a
					href="{base}{path.href}"
					class="text-sm font-medium transition-colors hover:text-primary"
					class:text-muted-foreground={$page.route.id != (path.urlId ?? path.href)}
				>
					{path.name}
				</a>
			{/each}
		</nav>

		<div class="mx-auto" />

		<form
			method="get"
			action="{base}/s"
			class="transition-[width] duration-700 {$page.route.id == '/s' ? 'w-[calc(100%-12rem)]' : 'w-48 md:w-64'}"
		>
			<Input
				name="q"
				autocomplete="off"
				type="search"
				placeholder="Search ModDB..."
				class="w-full"
				bind:value={searchedFor}
				on:focus={() =>
					goto(`${base}/s?q=${encodeURIComponent(searchedFor)}`, { keepFocus: true, noScroll: true })}
				on:input={() => ($searchQueryStore = searchedFor)}
			/>
		</form>

		<!-- <Button
			on:click={() => {
				var event = new KeyboardEvent('keydown', {
					key: 'k',
					metaKey: true,
					ctrlKey: true
				});
				window.dispatchEvent(event);

				toast.info('You can also engage search by pressing ⌘+K or ⌘+Space on your keyboard!');
			}}
			variant="outline"
		>
			Search ModDB...
		</Button> -->

		<Button variant={$page.route.id == '/settings' ? 'default' : 'ghost'} size="icon" href="{base}/settings">
			<Settings />
		</Button>
	</div>
</header>
