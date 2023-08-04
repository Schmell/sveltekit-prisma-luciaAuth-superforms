import { auth } from '$lib/server/lucia';
import { fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
// import { db } from '$lib/server/db';
import { generatePasswordResetToken } from '$lib/server/token';
import { isValidEmail, sendPasswordResetLink } from '$lib/server/email';

import type { Actions } from './$types';
import type { UserSchema } from 'lucia';
import { actionResult, message, setError, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

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
	default: async ({ request }) => {
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
				form.valid = false;
				setError(form, 'email', 'User does not exist');
				return message(form, 'User does not exist', {
					status: 403
				});
			}

			const user = auth.transformDatabaseUser(storedUser as UserSchema);
			const token = await generatePasswordResetToken(user.userId);
			await sendPasswordResetLink(token);
			// throw redirect(303,'/emailLogin', {
			// 	type: 'success',
			// 	message: 'Check email for reset link'
			// });

			actionResult('redirect', '/emailLogin', {
				message: { type: 'success', message: 'Check email for reset link' },
				status: 303
			});

			// return {
			// 	success: true
			// };
		} catch (e) {
			// check LuciaErrors
			// check PrismaKnownErrors
			return fail(500, {
				message: 'An unknown error occurred'
			});
		}
	}
};
