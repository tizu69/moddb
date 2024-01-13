<script lang="ts">
	import { page } from '$app/stores';
	import { IconHome, IconArrowLeft } from '@tabler/icons-svelte';
	import { base } from '$app/paths';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
</script>

<Card.Root class="mx-auto mt-8 w-96">
	<Card.Header>
		<Card.Title tag="h2">{$page.error?.message}</Card.Title>
		<Card.Description>error {$page.status}</Card.Description>
	</Card.Header>

	<Card.Content>An error occurred while trying to load this page. We apologize for the inconvenience.</Card.Content>

	<Card.Footer class="grid grid-cols-[auto_1fr] gap-2">
		<Button on:click={() => history.back()} size="icon" variant="outline">
			<IconArrowLeft />
		</Button>
		<Button class="w-full" href="{base}/">
			<IconHome class="mr-2" /> Go Home
		</Button>
	</Card.Footer>
</Card.Root>
