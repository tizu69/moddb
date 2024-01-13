import modrinth from './modrinth';

export const getSingleton = (): ModProvider => {
	// For each provider, get the ModProvider, then return a singleton that, upon used, calls ALL the providers' functions
	const providers = Object.values(Providers).map((provider) => getProvider(provider));

	const handle = async <R>(fn: string, ...args: any[]): Promise<R> => {
		// @ts-expect-error
		return (await Promise.all(providers.map((provider) => provider[fn](...args)))) as R;
	};

	return {
		getMods: (query: string) => handle('getMods', query)
	};
};

export const getProvider = (name: Providers): ModProvider => {
	switch (name) {
		case Providers.Modrinth:
			return modrinth('https://api.modrinth.com/v2');
		case Providers.Curserinth:
			// The Curserinth API is the same as Modrinth, so we can use the same provider
			return modrinth('https://curserinth-api.kuylar.dev/v2');
		default:
			throw new Error('Unknown provider');
	}
};

/* --- */

export enum Providers {
	Modrinth = 'modrinth',
	Curserinth = 'curserinth'
}

export interface ModProvider {
	getMods: (query: string) => Promise<Mod[]>;
}

export interface Mod {
	id: string;
	slug: string;

	name: string;
	description: string;

	icon: string;
	downloads: number;
}
