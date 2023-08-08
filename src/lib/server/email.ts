import { redirect } from 'sveltekit-flash-message/server';
import { createTransporter } from '$lib/emails/createTransporter';
import { CALLBACK_HOST } from '$env/static/private';
import { dev } from '$app/environment';

//emailOptions - who sends what to whom
const sendEmail = async (emailOptions) => {
	let emailTransporter: any = await createTransporter();
	await emailTransporter.sendMail(emailOptions);
};

export const sendEmailVerificationLink = async (email: string, token: string) => {
	const url = `${CALLBACK_HOST}/email-verification/${token} `;

	const message = {
		from: '',
		to: email,
		subject: 'Verify your password',
		text: 'Svelte-way would like you to verify the password you just used',
		html: `<p>Verify your account by clicking the link below</p> <a href=${url}>${url}</a>`
	};

	try {
		console.log('trans.sendMail(message);: ', message);
		sendEmail(message);
	} catch (error) {
		console.log('sendEmailVerificationLink error: ', error);
	}

	if (dev) console.log(`Your email verification link: ${url}`);
};

export const sendPasswordResetLink = async (email: string, token: string, event) => {
	const url = `${CALLBACK_HOST}/password-reset/${token}`;
	const message = {
		from: '',
		to: email,
		subject: 'Reset your password',
		text: 'You have requested to reset your password for the svelte-way app',
		html: `<p>Verify your account by clicking the link below</p> <a href=${url}>${url}</a>`
	};
	try {
		sendEmail(message);
		if (dev) console.log(`Your password reset link: ${url}`);
		return {
			success: true
		};
	} catch (error) {
		console.log('error: ', error);
		return {
			success: false,
			message: error
		};
	}
};

export const isValidEmail = (maybeEmail: unknown): maybeEmail is string => {
	if (typeof maybeEmail !== 'string') return false;
	if (maybeEmail.length > 255) return false;
	const emailRegexp = /^.+@.+$/; // [one or more character]@[one or more character]
	return emailRegexp.test(maybeEmail);
};
