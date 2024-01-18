<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { ArrowLeft, Home } from 'lucide-svelte';
	import * as Card from '$ui/card';
	import { Button } from '$ui/button';
</script>

<Card.Root class="mx-auto mt-8 w-96">
	<Card.Header>
		<Card.Title class="font-heading">{$page.error?.message}</Card.Title>
		<Card.Description class="text-sm text-muted-foreground">error {$page.status}</Card.Description>
	</Card.Header>

	<Card.Content>
		<p>An error occurred while trying to load this page. We apologize for the inconvenience.</p>
	</Card.Content>

	<Card.Footer class="grid grid-cols-[auto_1fr] gap-2 Card.Root-footer">
		<Button on:click={() => history.back()} variant="ghost" size="icon">
			<ArrowLeft />
		</Button>
		<Button class="w-full" href="{base}/">
			<Home class="mr-2" /> Go Home
		</Button>
	</Card.Footer>
</Card.Root>
