<script lang="ts">
	import { Button } from '$ui/button';
	import type { Builder } from 'bits-ui';

	export let icon: ConstructorOfATypedSvelteComponent;
	export let title: string;

	export let href: string | undefined = undefined;

	export let builders: Builder[] = [];
</script>

<Button
	variant="link"
	class="flex items-center gap-1 w-fit p-0 h-auto justify-start"
	{builders}
	target="_blank"
	{href}
	on:click
>
	<svelte:component this={icon} class="w-4 h-4" />
	{title}
</Button>
