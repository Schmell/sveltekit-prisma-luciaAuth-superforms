import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { USER_EMAIL, CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } from '$env/static/private';

const OAuth2 = google.auth.OAuth2;

export const createTransporter = async () => {
	try {
		const oauth2Client = new OAuth2(
			CLIENT_ID,
			CLIENT_SECRET,
			'https://developers.google.com/oauthplayground'
		);

		oauth2Client.setCredentials({
			refresh_token: process.env.REFRESH_TOKEN
		});

		const accessToken = await new Promise((resolve, reject) => {
			oauth2Client.getAccessToken((err, token) => {
				if (err) {
					console.log('*ERR: ', err);
					reject();
				}
				resolve(token);
			});
		});

		const transporter = nodemailer.createTransport({
			// not sure why im not getting proper types from nodemailer
			// @ts-ignore
			service: 'gmail',
			auth: {
				type: 'OAuth2',
				user: USER_EMAIL,
				accessToken,
				clientId: CLIENT_ID,
				clientSecret: CLIENT_SECRET,
				refreshToken: REFRESH_TOKEN
			}
		});
		return transporter;
	} catch (err) {
		console.log('err: ', err);
		return err;
	}
};
