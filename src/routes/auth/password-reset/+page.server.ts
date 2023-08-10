import { auth } from '$lib/server/lucia';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import type { Actions } from './$types';
import type { UserSchema } from 'lucia';

import { generatePasswordResetToken } from '$lib/server/token';
import { isValidEmail, sendPasswordResetLink } from '$lib/server/email';

import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { redirect } from 'sveltekit-flash-message/server';
import { capitalizeFirstLetter } from '$lib/utils';
import { Prisma } from '@prisma/client';
// import { updateFlash } from 'sveltekit-flash-message/client';

const passwordResetSchema = z.object({
	email: z.string().email()
});

export const load = async ({ locals }) => {
	const form = await superValidate(passwordResetSchema);
	return { form };
};

export const actions: Actions = {
	default: async (event) => {
		const { request } = event;
		const form = await superValidate(request, passwordResetSchema);

		if (!form.valid) {
			return fail(400, { form });
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

			await sendPasswordResetLink(form.data.email, token);

			throw redirect(
				307,
				'/auth/login',
				{ type: 'success', message: 'Check your email for a reset link' },
				event
			);
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
