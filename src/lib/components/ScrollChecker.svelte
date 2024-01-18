<script lang="ts">
	import { inview } from 'svelte-inview';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let visible = false;
</script>

<span
	use:inview
	on:inview_change={(e) =>
		setTimeout(() => {
			visible = e.detail.inView;
			dispatch('change', visible);
		}, 10)}
>
	<slot {visible} />
</span>
