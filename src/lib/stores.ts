import { writable } from 'svelte/store';
import type { Providers } from './providers/common';
import { localStorageStore } from './lss';

export const searchQueryStore = writable('');
export const sttDataStore = writable('');

export const userConfigStore = localStorageStore<{
	v: number;
	providers: Providers[];
	search: {
		limit: number;
		sort: 'relevance' | 'downloads' | 'watches';
		// preferredModSource: Providers[]; - this uses the providers enum now
	};
	lessSanitize: boolean;
}>('userConfig', {
	v: 1,
	providers: ['modrinth', 'curserinth'] as Providers[],
	search: {
		limit: 20,
		sort: 'relevance'
	},
	lessSanitize: false
});
