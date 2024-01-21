import { base } from '$app/paths';
import { redirect } from '@sveltejs/kit';

export const load = async ({ params }) => {
	throw redirect(302, `${base}/p/${params.id}/readme`);
};
