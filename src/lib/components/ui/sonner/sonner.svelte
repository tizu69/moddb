<script lang="ts">
	import { Toaster as Sonner, type ToasterProps as SonnerProps } from 'svelte-sonner';

	type $$Props = SonnerProps;
</script>

<Sonner
	theme="dark"
	class="toaster group"
	toastOptions={{
		classes: {
			toast: 'group toast group-[.toaster]:bg-surface-700 group-[.toaster]:text-on-surface group-[.toaster]:border-surface-300-600-token group-[.toaster]:shadow-lg',
			description: 'group-[.toast]:text-on-surface opacity-75',
			actionButton: 'group-[.toast]:variant-filled-primary',
			cancelButton: 'group-[.toast]:variant--primary'
		}
	}}
	{...$$restProps}
/>
