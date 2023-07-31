import { auth } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';

import type { Actions } from './$types';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const { name, username, email, avatar, password } = Object.fromEntries(
			await request.formData()
		) as Record<string, string>;
		// basic check
		if (typeof username !== 'string' || username.length < 2 || username.length > 31) {
			// console.log('Invalid username', 'Invalid username');
			return fail(400, {
				message: 'Invalid username'
			});
		}
		if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
			console.log('Invalid password: ');
			return fail(400, {
				message: 'Invalid password'
			});
		}
		try {
			const user = await auth.createUser({
				key: {
					providerId: 'username', // auth method
					providerUserId: username.toLowerCase(), // unique id when using "username" auth method
					password // hashed by Lucia
				},
				attributes: {
					github_username: username,
					username,
					email,
					name,
					avatar
				}
			});
			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});
			locals.auth.setSession(session); // set session cookie
		} catch (e) {
			if (
				e instanceof PrismaClientKnownRequestError &&
				e.message === 'Unique constraint failed on the fields: (`username`)'
			) {
				return fail(400, {
					message: 'Username already taken'
				});
			}
			return fail(500, {
				message: 'An unknown error occurred'
			});
		}
		// redirect to
		// make sure you don't throw inside a try/catch block!
		throw redirect(302, '/');
	}
};
