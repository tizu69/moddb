<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { base } from '$app/paths';
	import { Button } from '$ui/button';
	import * as Card from '$ui/card';
</script>

<svelte:head><title>ModDB</title></svelte:head>

<Card.Root class="h-[calc(100vh-8rem)] rounded-3xl flex flex-col justify-center items-center">
	<Card.Content class="space-y-4">
		<img src="{base}/favicon.png" alt="ModDB icon" class="h-32 w-auto min-w-[auto] mx-auto" />

		<p class="text-xl !font-normal [&_b]:font-bold [&_b]:text-primary font-heading">
			Explore <b>tons</b> of mods, plugins and more with <b>ModDB</b>. <br />
			<b>The</b> way to use <Tooltip.Root>
				<Tooltip.Trigger>all of <b>your favourite mod hosts</b></Tooltip.Trigger>
				<Tooltip.Content>Availability of mod hosts differs, see settings for a full list</Tooltip.Content>
			</Tooltip.Root> in a <b>single</b> app. <br />
			If you're into <b>modding</b>, you're gonna love <b>ModDB</b>.
		</p>

		<div class="flex gap-2 justify-center">
			<Button href="{base}/s">Start exploring</Button>
		</div>
	</Card.Content>
</Card.Root>
