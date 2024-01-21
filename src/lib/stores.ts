import { writable } from 'svelte/store';
import type { Providers } from './providers/common';
import { localStorageStore } from './lss';
import consts from './consts';

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
	catppuccin: boolean;
}>('userConfig', {
	v: consts.CURRENT_CONFIG,
	...consts.CONFIG
});
