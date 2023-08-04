import type { PageServerLoad, Actions } from './$types';
import { auth } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { capitalizeFirstLetter } from '$lib/utils';
import { LuciaError } from 'lucia';

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
			// console.log('form: ', form);
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
			//  need to catch LuciaErrors here
			if (e instanceof LuciaError) {
				// this should be an import
				// need to catch all the auth erros here
				// need to deal with displaying/fixing error
				// console.log('e: ', e);

				// Check email and password or throw
				if (e.message === 'AUTH_INVALID_PASSWORD' || e.message === 'AUTH_INVALID_KEY_ID') {
					console.log('e.message: ', e.message);
					form.valid = false;
					form.errors = { password: ['invalid'], email: ['invalid'] };
					form.message = ' Unauthorized: Invalid Credentials';

					return fail(401, {
						form
					});
				}

				form.valid = false;
				form.message = e.message;

				return fail(500, {
					form
				});
			}

			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				console.log('e.code: ', e.code);
				// this should be reusable
				// Unique constraint violation
				if (e.code === 'P2002') {
					//@ts-ignore
					const propName = e.meta?.target[0];

					form.valid = false;

					form.errors[propName] = `${capitalizeFirstLetter(propName)} is already registered`;

					return fail(511, {
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
		}
		// redirect to profile page
		// make sure you don't throw inside a try/catch block!
		throw redirect(302, '/');
	}
};
