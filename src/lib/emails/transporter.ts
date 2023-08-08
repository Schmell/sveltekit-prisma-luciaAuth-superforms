import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
	host: 'localhost',
	port: 6379,
	secure: true,
	auth: {
		user: 'sheldon.street@gmail.com',
		pass: 'dpzfqoltlepqrzug'
	}
});
