<script lang="ts">
	import { page } from '$app/stores';
	import { IconHome, IconArrowLeft } from '@tabler/icons-svelte';
	import { base } from '$app/paths';
</script>

<div class="card mx-auto mt-8 w-96">
	<header class="card-header">
		<h2 class="h2">{$page.error?.message}</h2>
		<p class="text-sm opacity-75">error {$page.status}</p>
	</header>

	<section class="px-4 pt-2 pb-3">
		<p>An error occurred while trying to load this page. We apologize for the inconvenience.</p>
	</section>

	<footer class="grid grid-cols-[auto_1fr] gap-2 card-footer">
		<button on:click={() => history.back()} class="btn-icon-square variant-outline-secondary">
			<IconArrowLeft />
		</button>
		<a class="w-full btn variant-filled-primary" href="{base}/">
			<IconHome class="mr-2" /> Go Home
		</a>
	</footer>
</div>
