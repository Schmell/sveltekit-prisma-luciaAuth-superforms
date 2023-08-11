import { prisma } from '$lib/server/prisma.js';
import { error } from '@sveltejs/kit';
import { generateRandomString, isWithinExpiration } from 'lucia/utils';

const EXPIRES_IN = 1000 * 60 * 60 * 2; // 2 hours

export const generateEmailVerificationToken = async (userId: string) => {
	const storedUserTokens = await prisma.verificationToken.findMany({
		where: { user_id: userId }
	});

	if (storedUserTokens.length > 0) {
		const reusableStoredToken = storedUserTokens.find((token) => {
			// check if expiration is within 1 hour
			// and reuse the token if true
			return isWithinExpiration(Number(token.expires) - EXPIRES_IN / 2);
		});

		if (reusableStoredToken) return reusableStoredToken.id;
	}

	const token = generateRandomString(63);

	await prisma.verificationToken.create({
		data: {
			id: token,
			expires: new Date().getTime() + EXPIRES_IN,
			user_id: userId
		}
	});

	return token;
};

export const validateEmailVerificationToken = async (token: string) => {
	const storedToken = async () => {
		const storedToken = await prisma.verificationToken.findFirst({
			where: { id: token }
		});

		if (!storedToken) throw new Error('Invalid token');

		await prisma.verificationToken.delete({
			where: { user_id: storedToken.user_id }
		});

		return storedToken;
	};

	const { expires, user_id } = await storedToken();

	const tokenExpires = Number(expires); // bigint => number conversion

	if (!isWithinExpiration(tokenExpires)) {
		throw new Error('Expired token');
	}

	return user_id;
};

export const generatePasswordResetToken = async (userId: string) => {
	const storedUserTokens = await prisma.verificationToken.findMany({
		where: { user_id: userId }
	});

	if (storedUserTokens.length > 0) {
		const reusableStoredToken = storedUserTokens.find((token) => {
			// check if expiration is within 1 hour
			// and reuse the token if true
			return isWithinExpiration(Number(token.expires) - EXPIRES_IN / 2);
		});

		if (reusableStoredToken) return reusableStoredToken.id;
	}

	const token = generateRandomString(63);

	await prisma.verificationToken.create({
		data: {
			id: token,
			expires: new Date().getTime() + EXPIRES_IN,
			user_id: userId
		}
	});

	return token;
};

export const validatePasswordResetToken = async (token: string) => {
	//
	const storedToken = async () => {
		const storedToken = await prisma.verificationToken.findFirst({
			where: { id: token }
		});

		if (!storedToken) throw error(500, 'token is missing');

		await prisma.verificationToken.delete({
			where: { id: token }
		});

		return storedToken;
	};

	const { expires, user_id } = await storedToken();

	const tokenExpires = Number(expires); // bigint => number conversion

	if (!isWithinExpiration(tokenExpires)) {
		throw error(500, 'Expired token');
	}

	return user_id;
};

export const isValidPasswordResetToken = async (token: string) => {
	//
	const storedToken = await prisma.verificationToken.findFirst({
		where: { id: token }
	});

	if (!storedToken) return false;

	const tokenExpires = Number(storedToken.expires); // bigint => number conversion

	if (!isWithinExpiration(tokenExpires)) {
		return false;
	}

	return true;
};
