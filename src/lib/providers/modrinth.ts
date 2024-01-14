import type { Providers, ModProvider } from './common';

export default (server: string, source?: Providers) =>
	({
		getMods: async (query, limit, offset) => {
			limit ??= 20;
			offset ??= 0;

			const response = await fetch(`${server}/search?query=${query}&limit=${limit}&offset=${offset}`);
			if (!response.ok) throw new Error('Failed to fetch mods');

			const json = await response.json();
			return {
				count: json.total_hits,
				mods: json.hits.map((item: any) => ({
					id: item.id,
					slug: item.slug.replace(/^.*__/g, ''),

					name: item.title,
					description: item.description,

					downloads: item.downloads,
					watches: item.follows || undefined,

					icon: item.icon_url,

					moddbSource: (source || 'modrinth') as Providers
				}))
			};
		}
	} as ModProvider);
