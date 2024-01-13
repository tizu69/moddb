import type { ModProvider } from './common';

export default (server: string) =>
	({
		getMods: async (query) => {
			const response = await fetch(`${server}/search?query=${query}`);
			if (!response.ok) throw new Error('Failed to fetch mods');

			const json = await response.json();
			return json.hits.map((item: any) => ({
				id: item.id,
				slug: item.slug,

				name: item.title,
				description: item.description,

				icon: item.icon_url,
				downloads: item.downloads
			}));
		}
	} as ModProvider);
