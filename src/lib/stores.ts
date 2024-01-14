import { localStorageStore } from '@skeletonlabs/skeleton';
import { writable } from 'svelte/store';
import type { Providers } from './providers/common';

export const searchQueryStore = writable('');

export const userConfigStore = localStorageStore<{
	providers: Providers[];
	limit: number;
}>('userConfig', {
	providers: ['modrinth', 'curserinth'] as Providers[],
	limit: 20
});
