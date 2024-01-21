<script lang="ts">
	import { afterNavigate, beforeNavigate, onNavigate } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import NavBar from '$lib/components/NavBar.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { blur, scale } from 'svelte/transition';
	import { flyAndScale } from '$lib/utils';
	import { Button } from '$ui/button';
	import { ChevronUp } from 'lucide-svelte';
	import '../app.pcss';
	import { sttDataStore } from '$lib/stores';
	import { mediaQuery } from 'svelte-legos';
	import consts from '$lib/consts';

	const mobile = mediaQuery('(max-width: 1280px)');

	let time = 0;
	onMount(() => {
		setInterval(() => {
			time++;
		}, 100);

		toast.warning("You're using a beta version of ModDB!");
	});

	let ready = false;
	onMount(() => (ready = true));

	onNavigate((navigation) => {
		$sttDataStore = '';

		/* --- */

		if (!document.startViewTransition) return;
		if (navigation.from?.route.id == navigation.to?.route.id) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	let showSTT = false;

	const showError = (e: any) => {
		if (document.getElementById('errorCrashScreen')) return;

		const div = document.createElement('div');
		div.innerHTML = `
			<div
				class="fixed inset-0 flex justify-center items-center backdrop-blur backdrop-brightness-75 z-[999] flex-col gap-4"
				id="errorCrashScreen"	
			>
				<img src="${base}/favicon.png" alt="ModDB icon" class="h-16 w-auto min-w-[auto]" />
				<h1 class="text-2xl font-heading font-bold">A fatal error occurred :(</h1>
				
				${
					e.message
						? `
					<code
						class="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
					>
						${e.message}
					</code>`
						: '<p>This error could not be displayed.</p>'
				}
				${time < 20 ? '<p>If this error occurs during launch, you <b>might</b> have to reset your settings to fix it.</p>' : ''}

				<div class="flex gap-2">
					<button
						onclick="window.location.reload(), document.body.innerHTML = ''"
						class="rounded bg-destructive py-1 px-2"
					>
							Reload
					</button>
					<button
						onclick="document.getElementById('errorCrashScreen').remove()"
						class="p-1 text-primary underline"
					>
							Try without reloading
					</button>
					<button
						onclick="localStorage.removeItem('userConfig'), window.location.reload(), document.body.innerHTML = ''"
						class="p-1 text-muted underline opacity-25 hover:opacity-100"
					>
							Reset settings
					</button>
				</div>
			</div>`;
		(document.querySelector('body > div') ?? document.body).appendChild(div);
	};
</script>

<svelte:window
	on:unhandledrejection={showError}
	on:error={showError}
	on:scroll={(e) => (showSTT = window.scrollY > 128)}
/>

{#if ready}
	<Toaster theme="dark" visibleToasts={5} richColors />

	{#if showSTT}
		<div class="fixed bottom-4 right-4 gap-1 items-center flex z-20" transition:flyAndScale>
			<p class="py-1 px-2 rounded bg-background/80 backdrop-blur">{$sttDataStore}</p>
			<Button on:click={() => window.scroll({ top: 0, behavior: 'smooth' })} variant="outline" size="icon">
				<ChevronUp class="h-4 w-4" />
			</Button>
		</div>
	{/if}

	<header
		class="bg-destructive text-destructive-foreground p-4 text-center font-heading vtn-[dev-warning]"
		class:hidden={$page.route.id == '/'}
	>
		ModDB is in a very early stage of development. Please don't expect much from it right now, and be sure to report
		bugs and suggest new features.
	</header>

	<NavBar />

	{#if time < 10 && $page.status == 200}
		<div class="fixed inset-0 backdrop-blur backdrop-brightness-75 z-[999]" out:blur>
			<div
				class="flex gap-4 justify-center items-center h-full w-full"
				in:scale|global={{ start: 1.5, duration: 500 }}
			>
				<img src="{base}/favicon.png" alt="ModDB icon" class="h-16 w-auto min-w-[auto]" />
				<h1 class="text-6xl font-heading">ModDB</h1>
			</div>
		</div>
	{/if}

	<div class="container mx-auto">
		<main
			class={consts.SIDEBAR_PATHS.includes($page.route.id ?? '') && !$mobile
				? 'grid grid-cols-[280px_minmax(0,1fr)] gap-2'
				: 'p-4 flex flex-col gap-2'}
		>
			<slot />
		</main>
	</div>

	<!-- TODO: Put footer into its own component, if it gets any more complex -->
	<footer class="p-4 container mx-auto grid grid-cols-2 *:flex *:flex-col *:gap-2 gap-4">
		<div>
			<div class="flex gap-2 font-heading group w-fit">
				<img src="{base}/favicon.png" alt="ModDB icon" class="h-6 w-auto min-w-[auto]" />
				<p>ModDB <span class="hidden group-hover:inline text-sm font-heading">❤️ you</span></p>
			</div>
			<p>&copy; 2023-{new Date().getFullYear()} ModDB, a Tizu project.</p>

			<p class="text-sm text-muted-foreground">
				Not an official Minecraft product. Not approved by or associated with Mojang.
			</p>
			<p class="text-sm text-muted-foreground">
				ModDB is not approved by or associated with any of the providers available in ModDB.
			</p>
		</div>

		<div>
			<p class="text-sm text-muted-foreground">(no footer items)</p>
		</div>
	</footer>
{/if}
