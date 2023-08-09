import { auth, googleAuth } from '$lib/server/lucia.js';
import { OAuthRequestError } from '@lucia-auth/oauth';
import { Prisma } from '@prisma/client';
// import { fail, redirect } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';

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

	const { existingUser, googleUser, createUser, createKey } = await googleAuth.validateCallback(
		code
	);
	try {
		const getUser = async () => {
			if (existingUser) return existingUser;

			console.log('googleUser: ', googleUser);

			const user = await createUser({
				attributes: {
					username: googleUser.name,
					email: googleUser.email,
					name: googleUser.name,
					firstname: googleUser.given_name,
					lastname: googleUser.family_name,
					avatar: googleUser.picture,
					email_verified: 1
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

		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			// Unique constraint violation
			if (e.code === 'P2002') {
				// @ts-ignore
				const violatedField = e.meta?.target[0];
				if (violatedField === 'email') {
					const user = await prisma.user.findFirst({
						where: {
							email: googleUser.email
						}
					});
					if (user?.email_verified) {
						await createKey(user.id);
						const session = await auth.createSession({
							userId: user.id,
							attributes: {}
						});

						locals.auth.setSession(session);
					}
				}

				return new Response(null, {
					status: 302,
					headers: {
						Location: '/'
					}
				});

				// throw redirect(307, `/link-accounts?field=${violatedField}`);
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
