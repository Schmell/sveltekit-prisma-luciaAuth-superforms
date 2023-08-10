import { redirect, type Actions, fail } from '@sveltejs/kit';
import { loadFlash } from 'sveltekit-flash-message/server';

import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/lucia';

export const load: PageServerLoad = loadFlash(async (event) => {
	const { locals } = event;
	const session = await locals.auth.validate();

	if (!session) throw redirect(302, '/auth/login');

	return {
		user: session.user
	};
});

export const actions: Actions = {
	logout: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) return redirect(307, '/auth/login');
		await auth.invalidateSession(session.sessionId); // invalidate session
		locals.auth.setSession(null); // remove cookie
		throw redirect(302, '/auth/login'); // redirect to login page
	}
};
