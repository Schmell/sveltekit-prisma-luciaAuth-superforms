import { auth } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';
// import { SqliteError } from 'better-sqlite3';
import { generateEmailVerificationToken } from '$lib/server/token';
import { isValidEmail, sendEmailVerificationLink } from '$lib/server/email';
import { z } from 'zod';
import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { LuciaError } from 'lucia';
import { emailRegisterSchema } from './emailRegisterSchema';

// const emailRegisterSchema = z.object({
// 	username: z.string().min(2).max(18),
// 	// name: z.string().min(2).max(18).optional(),
// 	firstname: z.string().max(16),
// 	lastname: z.string().max(16),
// 	avatar: z.string().url().optional(),
// 	email: z.string().email(),
// 	password: z.string().min(6).max(12),
// 	confirm: z.string().min(6).max(12)
// });

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) {
		if (!session.user.emailVerified) throw redirect(302, '/email-verification');
		throw redirect(302, '/');
	}
	const form = await superValidate(emailRegisterSchema);

	return {
		session,
		form
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, emailRegisterSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const user = await auth.createUser({
				key: {
					providerId: 'email', // auth method
					providerUserId: form.data.email.toLowerCase(), // unique id when using "email" auth method
					password: form.data.password // hashed by Lucia
				},
				attributes: {
					username: form.data.username,
					name: form.data.name,
					email: form.data.email.toLowerCase(),
					// set verified to false on register
					email_verified: Number(false)
				}
			});

			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});

			locals.auth.setSession(session); // set session cookie
			const token = await generateEmailVerificationToken(user.userId);
			await sendEmailVerificationLink(token);
		} catch (e) {
			//  need to catch LuciaErros here
			if (e instanceof LuciaError) {
				return fail(500, {
					message: e.message
				});
			}

			console.log('e: ', e);

			return fail(500, {
				message: 'Unknown Error occured'
			});
		}
		// redirect to
		// make sure you don't throw inside a try/catch block!
		throw redirect(302, '/email-verification');
	}
};
