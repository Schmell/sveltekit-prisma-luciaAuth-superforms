import { dev } from '$app/environment';
import { githubAuth } from '$lib/server/lucia';

export const GET = async ({ cookies }) => {
	const [url, state] = await githubAuth.getAuthorizationUrl();
	console.log('url: ', url);
	// store state
	cookies.set('github_oauth_state', state, {
		httpOnly: true,
		secure: !dev,
		path: '/',
		maxAge: 60 * 60
	});
	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString()
		}
	});
};
