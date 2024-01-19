import type { Providers, ModProvider } from './common';

export default (
	server: string,
	source: Providers,
	extras?: {
		modNamePrefix?: string;
		frontendServer?: string;
	}
) =>
	({
		getMods: async ({ query, limit, offset, sort }) => {
			limit ??= 20;
			offset ??= 0;
			sort ??= 'relevance';

			const response = await fetch(
				`${server}/search` +
					`?query=${query}` +
					`&limit=${limit}` +
					`&offset=${offset}` +
					`&index=${(() => {
						switch (sort) {
							case 'watches':
								return 'follows';
							default:
								return sort;
						}
					})()}`
			);
			if (!response.ok) throw new Error('Failed to fetch mods from ' + source);

			const json = await response.json();
			return {
				count: json.total_hits,
				mods: json.hits.map((item: any) => ({
					id: item.id,
					slug: item.slug.replace(/^.*__/g, ''),

					name: item.title,
					description: item.description,
					author: item.author,

					downloads: item.downloads,
					watches: item.follows || 0,

					icon: item.icon_url,

					/* --- */

					moddbSource: (source || 'modrinth') as Providers
				}))
			};
		},
		getMod: async ({ id }) => {
			const response = await fetch(`${server}/project/${extras?.modNamePrefix || ''}${id}`);
			if (!response.ok) throw new Error('Failed to fetch mod ' + id + ' from ' + source);

			const json = await response.json();
			return [json].map((item: any) => ({
				id: item.id,
				slug: item.slug.replace(/^.*__/g, ''),

				name: item.title,
				description: item.description,
				author: item.author,

				downloads: item.downloads,
				watches: item.followers || 0,

				icon: item.icon_url,

				/* --- */

				longDescription: item.body,
				gallery: item.gallery.map((item: any) => ({
					url: item.url,
					title: item.title,
					description: item.description
				})),

				sourceUrl: (extras?.frontendServer || server) + '/mod/' + item.slug,

				/* --- */

				moddbSource: (source || 'modrinth') as Providers
			}))[0];
		}
	} as ModProvider);
