<script lang="ts">
	export let icon: ConstructorOfATypedSvelteComponent;
	export let stat: string;
	export let sub: string;
</script>

<div class="flex justify-between border-y-2 border-transparent hover:border-border space-x-4">
	<div class="flex items-center gap-1">
		<svelte:component this={icon} class="w-4 h-4" />
		<p class="text-sm text-muted-foreground">
			{sub}
		</p>
	</div>

	<p class="font-bold overflow-dots">
		{stat}
	</p>
</div>
