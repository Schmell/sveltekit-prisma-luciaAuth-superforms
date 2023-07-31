// src/lib/server/lucia.ts
import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { dev } from '$app/environment';
import { prisma as prismaAdapter } from '@lucia-auth/adapter-prisma';
import { prisma } from '$lib/server/prisma';
import { github, google, facebook } from '@lucia-auth/oauth/providers';

import {
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET,
	GITHUB_CLIENT_REDIRECTURI,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GOOGLE_CLIENT_REDIRECTURI,
	FACEBOOK_CLIENT_ID,
	FACEBOOK_CLIENT_SECRET,
	FACEBOOK_CLIENT_REDIRECTURI
} from '$env/static/private';

export const auth = lucia({
	adapter: prismaAdapter(prisma, {
		user: 'user', // model User {}
		key: 'key', // model Key {}
		session: 'session' // model Session {}
	}),
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),

	getUserAttributes: (data) => {
		return {
			username: data.username,
			email: data.email,
			name: data.name,
			avatar: data.avatar
		};
	}
});

export const githubAuth = github(auth, {
	clientId: GITHUB_CLIENT_ID,
	clientSecret: GITHUB_CLIENT_SECRET,
	redirectUri: GITHUB_CLIENT_REDIRECTURI
});

export const googleAuth = google(auth, {
	clientId: GOOGLE_CLIENT_ID,
	clientSecret: GOOGLE_CLIENT_SECRET,
	redirectUri: GOOGLE_CLIENT_REDIRECTURI,
	scope: ['https://www.googleapis.com/auth/userinfo.profile']
	// https://schmelte.up.railway.app/login/google/callback
	// ?state=xbh0wb5auubwejrb4jl1a2t4h277nx5289devy01f8h
	// &code=4%2F0AZEOvhVP1lUP96QTS8dZEBSTWPsSinczAjWDYmxShl4UnsFUjxBJGdtDneqisw-8L5QL5A
	// &scope=profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile
});

export const facebookAuth = facebook(auth, {
	clientId: FACEBOOK_CLIENT_ID,
	clientSecret: FACEBOOK_CLIENT_SECRET,
	redirectUri: FACEBOOK_CLIENT_REDIRECTURI
	// scope: ['https://www.googleapis.com/auth/userinfo.profile']
});

export type Auth = typeof auth;
