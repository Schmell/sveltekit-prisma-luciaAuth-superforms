import { auth, googleAuth } from '$lib/server/lucia.js';
import { OAuthRequestError } from '@lucia-auth/oauth';
import { Prisma } from '@prisma/client';
import { fail, redirect } from '@sveltejs/kit';

export const GET = async ({ url, cookies, locals }) => {
	const storedState = cookies.get('google_oauth_state');
	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');

	// validate state
	if (!storedState || !state || storedState !== state || !code) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		const { existingUser, googleUser, createUser } = await googleAuth.validateCallback(code);

		const getUser = async () => {
			if (existingUser) return existingUser;

			const user = await createUser({
				attributes: {
					google_username: googleUser.name,
					username: googleUser.name,
					email: googleUser.email,
					name: googleUser.name,
					avatar: googleUser.picture
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
		//
	} catch (e) {
		//
		if (e instanceof OAuthRequestError) {
			console.log('OAuthRequestError: ', e);
			// invalid code
			return new Response(null, {
				status: 400
			});
		}
		// Catch prisma error
		// could link the account but need to re-verify email
		// http://localhost:5173/login/google/callback?state=2aduqs6bjs3cjcdovpqff1l3m56edilifeh9xt4q3s2&code=4%2F0Adeu5BVuAyfAMXEnnUVYQwoozdDtpeQhQlpwiDSvY5wcw8HyHkZ9XzAYA0APULba0e9ucQ&scope=email+profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+openid&authuser=0&prompt=consent
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			// Unique constraint violation
			if (e.code === 'P2002') {
				// @ts-ignore
				console.log('Unique constraint: ', e.meta?.target[0]);
				// @ts-ignore
				throw redirect(300, `/link-accounts?field=${e.meta?.target[0]}`);
			}

			// Can't reach database server
			if (e.code === 'P1001') {
				console.log(' Cant reach database server: ', e.message);
				return new Response(null, {
					status: 500
				});
			}
			console.log('prisma known error: ', e);
		}

		console.log('google OAuth callback error: ', e);
		return new Response(null, {
			status: 500
		});
	}
};
