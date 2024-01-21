import { userConfigStore } from '$lib/stores';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';
import { toast } from 'svelte-sonner';
import { Providers, getProvider, type ModMember, type ModProject, type ModVersion } from '$lib/providers/common';

export const load: PageLoad = async ({ params }) => {
	const loadingToast: string | number = toast.loading(
		`Fetching ${params.id} from ${get(userConfigStore).providers.length} providers...`
	);

	const mods: {
		[provider in Providers]?: ModProject & {
			_versions?: ModVersion[];
			_members?: ModMember[];
		};
	} = {};
	let provider: Providers | undefined = undefined;

	await Promise.all(
		Object.values(get(userConfigStore).providers).map((p) => {
			if (!Object.values(Providers).includes(p)) return toast.error(`Rejected unknown provider: ${p}`);

			return (
				getProvider(p)
					.getMod({
						id: params.id
					})
					.then(async (d) => {
						mods[p] = d;
						provider ??= p;

						await getProvider(p)
							.getVersions({
								id: params.id
							})
							.then((d) => {
								// @ts-expect-error // FIXME: I got no clue why this is not working
								mods[p]._versions = d;
							});
						await getProvider(p)
							.getMembers({
								id: params.id
							})
							.then((d) => {
								// @ts-expect-error // FIXME: I got no clue why this is not working
								mods[p]._members = d;
							});
					})
					// TODO: Handle error properly, this just disregards it as providers may not serve the mod
					.catch(console.error)
			);
		})
	);

	if (loadingToast) toast.dismiss(loadingToast);

	return {
		mods: mods as {
			[provider in Providers]?: ModProject & {
				_versions: ModVersion[];
				_members: ModMember[];
			};
		},
		provider
	};
};
