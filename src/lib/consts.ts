import type { Providers } from './providers/common';

export default {
	SIDEBAR_PATHS: ['/p/[id]/[tab]'],
	CURRENT_CONFIG: 2,
	CONFIG: {
		providers: ['Modrinth', 'CurseRinth'] as Providers[],
		search: {
			limit: 20,
			sort: 'relevance' as const
		},
		lessSanitize: false,
		catppuccin: false
	}
};
