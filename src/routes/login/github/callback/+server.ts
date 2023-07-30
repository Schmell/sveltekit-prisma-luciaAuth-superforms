import { auth, githubAuth } from '$lib/server/lucia.js';
import { OAuthRequestError } from '@lucia-auth/oauth';
// http://localhost:5173/login/github/callback?code=897192588be93cec42d5&state=5xnqatfsoztizmqs4x9gwml4x4bcvbsmz184tt2klhz
export const GET = async ({ url, cookies, locals }) => {
	const storedState = cookies.get('github_oauth_state');
	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');

	// validate state
	if (!storedState || !state || storedState !== state || !code) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		const { existingUser, githubUser, createUser } = await githubAuth.validateCallback(code);
		// console.log('existingUser: ', existingUser);
		console.log('githubUser: ', githubUser);

		const getUser = async () => {
			if (existingUser) return existingUser;

			const user = await createUser({
				attributes: {
					github_username: githubUser.login,
					username: githubUser.login,
					email: githubUser.email ?? '',
					name: githubUser.name ?? '',
					avatar: githubUser.avatar_url
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
