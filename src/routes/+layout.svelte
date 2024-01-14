<script>
	import { onNavigate } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import NavBar from '$lib/components/NavBar.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { blur } from 'svelte/transition';
	import '../app.pcss';

	let time = 0;
	onMount(() => {
		setInterval(() => {
			time++;
		}, 100);

		toast.warning("You're using a beta version of ModDB!");
	});

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		if (navigation.from?.route.id == navigation.to?.route.id) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	const showError = () => {
		const div = document.createElement('div');
		div.innerHTML = `
			<div
				class="absolute inset-0 flex justify-center items-center backdrop-blur backdrop-brightness-75 z-[999] flex-col gap-4"
				id="errorCrashScreen"	
			>
				<img src="${base}/favicon.png" alt="ModDB icon" class="h-16 w-auto min-w-[auto]" />
				<h1 class="text-2xl font-heading">A fatal error occurred :(</h1>

				<div class="flex gap-2">
					<button
						onclick="window.location.reload(), document.body.innerHTML = ''"
						class="btn variant-outline-error"
					>
							Reload
					</button>
					<button
						onclick="document.getElementById('errorCrashScreen').remove()"
						class="btn variant-filled-primary"
					>
							Try without reloading
					</button>
				</div>
			</div>`;
		(document.querySelector('body > div') ?? document.body).appendChild(div);
	};
</script>

<svelte:window on:unhandledrejection={showError} on:error={showError} />

<Toaster theme="dark" visibleToasts={5} />

<NavBar />

{#if time < 5 && $page.status == 200}
	<div class="absolute inset-0 backdrop-blur backdrop-brightness-75 z-[999]" out:blur>
		<div class="flex gap-4 justify-center items-center h-full w-full">
			<img src="{base}/favicon.png" alt="ModDB icon" class="h-16 w-auto min-w-[auto]" />
			<h1 class="text-6xl font-heading">ModDB</h1>
		</div>
	</div>
{/if}

<main class="container mx-auto p-4 flex flex-col gap-2">
	<slot />
</main>

<!-- TODO: Put footer into its own component, if it gets any more complex -->
<footer class="p-4 container mx-auto grid grid-cols-2 *:flex *:flex-col *:gap-2">
	<div>
		<div class="flex gap-2 font-heading group w-fit">
			<img src="{base}/favicon.png" alt="ModDB icon" class="h-6 w-auto min-w-[auto]" />
			<p>ModDB <span class="hidden group-hover:inline text-sm font-heading">❤️ you</span></p>
		</div>
	</div>

	<div>
		<p>&copy; 2022-{new Date().getFullYear()} ModDB, a Tizu project.</p>
	</div>
</footer>
