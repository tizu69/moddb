import modrinth from './modrinth';

export const getProvider = (name: Providers): ModProvider => {
	const message = 'Unknown provider: ' + name;

	switch (name) {
		case Providers.Modrinth:
			return modrinth('https://api.modrinth.com/v2', Providers.Modrinth, {
				frontendServer: 'https://modrinth.com'
			});
		case Providers.ModrinthStaging:
			return modrinth('https://staging-api.modrinth.com/v2', Providers.ModrinthStaging, {
				frontendServer: 'https://staging.modrinth.com'
			});
		case Providers.Curserinth:
			// The Curserinth API is the same as Modrinth, so we can use the same provider
			return modrinth('https://curserinth-api.kuylar.dev/v2', Providers.Curserinth, {
				modNamePrefix: 'mod__',
				frontendServer: 'https://curserinth-tizu.vercel.app'
			});

		default:
			throw new Error(message);
	}
};

/* --- */

export enum Providers {
	Modrinth = 'modrinth',
	ModrinthStaging = 'modrinthStaging',
	Curserinth = 'curserinth'
}

export interface ModProvider {
	getMods: (options: {
		query: string;
		limit?: number;
		offset?: number;
		sort?: 'relevance' | 'downloads' | 'watches';
	}) => Promise<{ count: number; mods: Mod[] }>;
	getMod: (options: { id: string }) => Promise<ModProject>;
}

export interface Mod {
	id: string;
	slug: string;

	name: string;
	description: string;
	author: string;

	downloads: number;
	watches?: number;

	icon: string;

	moddbSource: Providers | Providers[];
}

export interface ModProject extends Mod {
	longDescription: string;

	gallery: {
		url: string;
		title: string;
		description: string;
	}[];

	info: {
		versions: string[];
		loaders: string[];
		license: {
			name: string;
			url: string;
		};
	};

	links: {
		issues?: string;
		source?: string;
		wiki?: string;
		discord?: string;
		donations?: {
			name: string;
			url: string;
		}[];
	};

	dates: {
		created: string;
		updated: string;
	};

	sourceUrl: string;
}
