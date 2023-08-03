import type { PageServerLoad, Actions } from './$types';
import { auth } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) {
		if (!session.user.emailVerified) throw redirect(302, '/email-verification');
		throw redirect(302, '/');
	}
	const form = await superValidate(emailLoginSchema);
	return { form };
};

const emailLoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6).max(12)
});

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, emailLoginSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			// find user by key // and validate password
			const key = await auth.useKey('email', form.data.email.toLowerCase(), form.data.password);

			const session = await auth.createSession({
				userId: key.userId,
				attributes: {}
			});

			locals.auth.setSession(session); // set session cookie4
		} catch (e: any) {
			// let errors;

			return fail(400, { form });
			// return {
			// 	form
			// };
		}
		// redirect to profile page
		// make sure you don't throw inside a try/catch block!
		throw redirect(302, '/');
	}
};
