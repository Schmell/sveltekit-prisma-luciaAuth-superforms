import { auth } from '$lib/server/lucia';
import { validateEmailVerificationToken } from '$lib/server/token';
import { setFlash } from 'sveltekit-flash-message/server';

import type { RequestHandler } from './$types';
import { from } from '$lib/utils';

export const GET: RequestHandler = async (event) => {
	const { params, locals, url } = event;
	const { token } = params;

	try {
		const userId = await validateEmailVerificationToken(token);
		const user = await auth.getUser(userId);

		await auth.invalidateAllUserSessions(user.userId);

		await auth.updateUserAttributes(user.userId, {
			email_verified: Number(true)
		});

		const session = await auth.createSession({
			userId: user.userId,
			attributes: {}
		});

		locals.auth.setSession(session);

		setFlash({ type: 'success', message: 'Email verified' }, event);

		return new Response(null, {
			// make sure its a redirect code
			status: 301,
			headers: {
				Location: `/${from(url)}`
			}
		});
	} catch {
		return new Response('Invalid email verification link', {
			status: 400
		});
	}
};
