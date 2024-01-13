import { writable } from 'svelte/store';
import { getSingleton } from './providers/common';

export const searchQueryStore = writable('');
export const singletonStore = writable(getSingleton());
