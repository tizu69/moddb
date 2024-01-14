import modrinth from './modrinth';

export const getProvider = (name: Providers): ModProvider => {
	switch (name) {
		case Providers.Modrinth:
			return modrinth('https://api.modrinth.com/v2');
		case Providers.ModrinthStaging:
			return modrinth('https://staging-api.modrinth.com/v2', Providers.ModrinthStaging);
		case Providers.Curserinth:
			// The Curserinth API is the same as Modrinth, so we can use the same provider
			return modrinth('https://curserinth-api.kuylar.dev/v2', Providers.Curserinth);
		default:
			throw new Error('Unknown provider');
	}
};

/* --- */

export enum Providers {
	Modrinth = 'modrinth',
	ModrinthStaging = 'modrinthStaging',
	Curserinth = 'curserinth'
}

export interface SingletonModProvider {
	getMods: (query: string, limit?: number, offset?: number) => Promise<{ count: number; mods: Mod[] }>;
}

export interface ModProvider extends SingletonModProvider {}

export interface Mod {
	id: string;
	slug: string;

	name: string;
	description: string;

	downloads: number;
	watches?: number;

	icon: string;

	moddbSource: Providers | Providers[];
}
