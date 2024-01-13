<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Button } from '$lib/components/ui/button';
	import { base } from '$app/paths';
</script>

<svelte:head><title>ModDB</title></svelte:head>

<!-- TODO: background? -->
<div class="h-[calc(100vh-8rem)] flex flex-col justify-center items-center bg-muted rounded-3xl gap-4">
	<p class="text-xl font-normal [&_b]:font-bold [&_b]:text-primary font-heading">
		Explore <b>tons</b> of mods, plugins and more with <b>ModDB</b>. <br />
		<b>The</b> way to use <Tooltip.Root>
			<Tooltip.Trigger><b>your favourite mod hosts</b></Tooltip.Trigger>
			<Tooltip.Content>Currently supports Modrinth and CurseForge</Tooltip.Content>
		</Tooltip.Root> in a <b>single</b> app. <br />
		If you're into <b>modding</b>, you're gonna love <b>ModDB</b>.
	</p>

	<div class="flex gap-2">
		<Button href="{base}/s">Start exploring</Button>
	</div>
</div>
