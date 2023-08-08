import { auth, facebookAuth } from '$lib/server/lucia.js';
import { OAuthRequestError } from '@lucia-auth/oauth';

export const GET = async ({ url, cookies, locals }) => {
	const storedState = cookies.get('facebook_oauth_state');
	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');

	// validate state
	if (!storedState || !state || storedState !== state || !code) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		const { existingUser, facebookUser, createUser } = await facebookAuth.validateCallback(code);

		console.log('facebookUser: ', facebookUser);

		const getUser = async () => {
			if (existingUser) return existingUser;

			const user = await createUser({
				attributes: {
					facebook_username: facebookUser.name,
					username: facebookUser.name,
					name: facebookUser.name,
					avatar: facebookUser.picture.data.url
				}
			});

			return user;
		};

		const user = await getUser();

		const session = await auth.createSession({
			userId: user.userId,
			attributes: {}
		});

		locals.auth.setSession(session);

		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	} catch (e) {
		if (e instanceof OAuthRequestError) {
			// invalid code
			return new Response(null, {
				status: 400
			});
		}

		return new Response(null, {
			status: 500
		});
	}
};
