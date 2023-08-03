// import { db } from './db.js';
import { prisma } from '$lib/server/prisma.js';
import { generateRandomString, isWithinExpiration } from 'lucia/utils';

const EXPIRES_IN = 1000 * 60 * 60 * 2; // 2 hours

export const generateEmailVerificationToken = async (userId: string) => {
	// const storedUserTokens = await db
	// 	.selectFrom('email_verification_token')
	// 	.selectAll()
	// 	.where('user_id', '=', userId)
	// 	.execute();
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

	// await db
	// 	.insertInto('email_verification_token')
	// 	.values({
	// 		id: token,
	// 		expires: new Date().getTime() + EXPIRES_IN,
	// 		user_id: userId
	// 	})
	// 	.executeTakeFirst();

	return token;
};

export const validateEmailVerificationToken = async (token: string) => {
	// const storedToken = await db.transaction().execute(async (trx) => {
	// const storedToken = await trx
	// 	.selectFrom('email_verification_token')
	// 	.selectAll()
	// 	.where('id', '=', token)
	// 	.executeTakeFirst();
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
	// const storedUserTokens = await db
	// 	.selectFrom('password_reset_token')
	// 	.selectAll()
	// 	.where('user_id', '=', userId)
	// 	.execute();
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

		if (!storedToken) throw new Error('Invalid token');

		await prisma.verificationToken.delete({
			where: { id: token }
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
