import { auth } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';
import { generateEmailVerificationToken } from '$lib/server/token';
import { sendEmailVerificationLink } from '$lib/server/email';
import type { PageServerLoad, Actions } from './$types';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { LuciaError } from 'lucia';
import { emailRegisterSchema } from './emailRegisterSchema';
import { Prisma } from '@prisma/client';
import { capitalizeFirstLetter } from '$lib/utils';

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
					email: form.data.email.toLowerCase(),
					username: form.data.username,
					name: `${form.data.firstname} ${form.data.lastname}`,
					firstname: form.data.firstname,
					lastname: form.data.lastname,
					avatar: form.data.avatar,
					// set verified to false on register
					email_verified: Number(false)
				}
			});

			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});

			// set session cookie
			locals.auth.setSession(session);

			const token = await generateEmailVerificationToken(user.userId);

			await sendEmailVerificationLink(form.data.email.toLowerCase(), token);
			//
		} catch (e: any) {
			//
			if (e instanceof LuciaError) {
				console.log('LuciaError: ', e);

				if (e.message === 'AUTH_INVALID_PASSWORD' || e.message === 'AUTH_INVALID_KEY_ID') {
					// this of course could be no user or bad password
					// reset both as to not give away to much to the client
					setError(form, 'email', '');
					setError(form, 'password', '');
					form.data.password = '';

					return message(form, 'Invalid Credentials', {
						status: 403
					});
				}

				form.valid = false;

				return message(form, e.message, {
					status: 400
				});
			}

			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				console.log('e.code: ', e.code);

				// Unique constraint violation
				if (e.code === 'P2002') {
					// @ts-ignore
					const propName = e.meta?.target[0];
					form.valid = false;
					form.errors[propName] = `${capitalizeFirstLetter(propName)} is already registered`;

					return fail(400, {
						form
					});
				}
				// Can't reach database server at
				if (e.code === 'P1001') {
					console.log(' Cant reach database server at: ', e.message);
					return fail(511, {
						message: e.message
					});
				}
			}

			if (e instanceof Prisma.PrismaClientValidationError) {
				console.log('PrismaClientValidationError: ', e);
				return fail(511, {
					message: e.message
				});
			}

			console.log('Unknown Error: ', e);
			return fail(500, {
				message: 'Unknown Error occured'
			});
		}
		// redirect to
		// make sure you don't throw inside a try/catch block!
		throw redirect(302, '/auth/email-verification');
	}
};
