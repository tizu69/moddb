<script lang="ts">
	import { markdown } from '$lib/common';
	import type { ModProject } from '$lib/providers/common';
	import * as Card from '$ui/card';
	import * as Tabs from '$ui/tabs';
	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';

	export let project: ModProject | undefined;
	let tab = 'summary';

	$: readme = markdown(project?.longDescription || '');

	const [send, receive] = crossfade({
		duration: 1500,
		easing: quintOut
	});
</script>

<!-- use your editors folding mechanism for easier navigation! -->

{#if project}
	<Tabs.Root bind:value={tab}>
		<Tabs.List>
			<Tabs.Trigger value="summary">Summary</Tabs.Trigger>
			<Tabs.Trigger value="readme">Description</Tabs.Trigger>
		</Tabs.List>

		<Tabs.Content value="summary">
			<Card.Root class="generic-button">
				<Card.Content class="overflow-y-clip max-h-64 pb-0 relative">
					<button class="w-full text-left" on:click={() => (tab = 'readme')}>
						<div class="z-10 to-card from-transparent bg-gradient-to-b absolute inset-0" />
						<p class="z-20 absolute bottom-2 text-center w-full">Click to expand</p>
						<div class="style-markdown flex flex-col gap-1 items-start">{@html readme}</div>
					</button>
				</Card.Content>
			</Card.Root>
		</Tabs.Content>

		<Tabs.Content value="readme">
			<Card.Root>
				<Card.Content>
					<div class="style-markdown flex select-text flex-col gap-1 items-start *:select-text">
						{@html readme}
					</div>
				</Card.Content>
			</Card.Root>
		</Tabs.Content>
	</Tabs.Root>
{/if}
