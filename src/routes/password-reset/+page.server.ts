import { auth } from '$lib/server/lucia';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import type { Actions } from './$types';
import type { UserSchema } from 'lucia';

import { generatePasswordResetToken } from '$lib/server/token';
import { isValidEmail, sendPasswordResetLink } from '$lib/server/email';

import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { redirect } from 'sveltekit-flash-message/server';
import { updateFlash } from 'sveltekit-flash-message/client';
import { page } from '$app/stores';
import { capitalizeFirstLetter } from '$lib/utils';
import { Prisma } from '@prisma/client';

const passwordResetSchema = z.object({
	email: z.string().email()
});

export const load = async ({ locals }) => {
	// const session = await locals.auth.validate();
	// if (session) {
	// 	if (!session.user.emailVerified) throw redirect(302, '/email-verification');
	// 	throw redirect(302, '/');
	// }
	const form = await superValidate(passwordResetSchema);
	return { form };
};

export const actions: Actions = {
	default: async (event) => {
		const { request } = event;
		const form = await superValidate(request, passwordResetSchema);
		// const formData = await request.formData();
		// const email = formData.get('email');
		if (!form.valid) {
			return fail(400, { form });
		}
		// basic check
		if (!isValidEmail(form.data.email)) {
			console.log('Invalid email: ');
			return fail(400, {
				message: 'Invalid email'
			});
		}

		try {
			const storedUser = await prisma.user.findFirst({
				where: { email: form.data.email }
			});

			if (!storedUser) {
				// form.valid = false;
				setError(form, 'email', 'User does not exist');
				return message(form, 'User does not exist', {
					status: 403
				});
			}

			const user = auth.transformDatabaseUser(storedUser as UserSchema);
			const token = await generatePasswordResetToken(user.userId);
			await sendPasswordResetLink(form.data.email, token, event);
			console.log('page: ', page);
			updateFlash(page);
			// throw redirect(303, '/login', { type: 'success', message: 'Checkit' }, event);
			// return setError(form, 'email', 'Check email for reset link');
		} catch (e) {
			console.log('e: ', e);
			// check LuciaErrors
			// Prisma errors
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				console.log('e.code: ', e.code);

				// Unique constraint violation
				if (e.code === 'P2002') {
					// @ts-ignore
					const propName = e.meta?.target[0];
					setError(form, propName, `${capitalizeFirstLetter(propName)} is already registered`);

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
			return fail(500, {
				message: 'An unknown error occurred'
			});
		}
	}
};
