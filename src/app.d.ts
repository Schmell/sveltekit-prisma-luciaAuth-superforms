// See https://kit.svelte.dev/docs/types#app

import type { PrismaClient } from '@prisma/client';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			auth: import('lucia').AuthRequest;
		}
		interface PageData {
			flash?: { type: 'success' | 'error'; message: string };
		}
		// interface Platform {}
	}
	var prisma: PrismaClient;
}

/// <reference types="lucia" />
declare global {
	namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type DatabaseUserAttributes = {
			facebook_username?: string;
			google_username?: string;
			github_username?: string;
			username: string;
			email?: string;
			email_verified?: number;
			name?: string;
			firstname?: string;
			lastname?: string;
			avatar?: string;
		};
		type DatabaseSessionAttributes = {};
	}
}

export {};
