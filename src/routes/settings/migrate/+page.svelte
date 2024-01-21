<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { successRewarder } from '$lib/common';
	import consts from '$lib/consts';
	import { userConfigStore } from '$lib/stores';
	import * as Card from '$ui/card';
	import { onMount } from 'svelte';

	onMount(() => {
		setTimeout(() => successRewarder(), 1000);
		setTimeout(() => window.history.back(), 5000);

		function updateMissingEntries(target: any, source: any) {
			for (const key in source) {
				if (typeof source[key] === 'object' && source[key] !== null) {
					if (!(key in target)) {
						if (Array.isArray(source[key])) {
							// Preserve array structure
							target[key] = source[key].map((item: any) => item);
						} else {
							target[key] = {};
						}
					}
					updateMissingEntries(target[key], source[key]);
				} else {
					if (!(key in target)) {
						target[key] = source[key];
					}
				}
			}
		}

		updateMissingEntries($userConfigStore, consts.CONFIG);
		$userConfigStore.v = consts.CURRENT_CONFIG;
	});
</script>

<svelte:head><title>ModDB</title></svelte:head>

<Card.Root class="h-[calc(100vh-8rem)] flex flex-col justify-center items-center bg-transparent border-0">
	<p class="text-6xl text-center !font-normal [&_b]:font-bold [&_b]:text-primary font-heading md:p-32">
		<b>ModDB</b> has just been <b>updated</b> - you're gonna love it!
	</p>
</Card.Root>
