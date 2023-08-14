import { z } from 'zod';

export const emailRegisterSchema = z
	.object({
		email: z.string().email(),
		username: z.string().min(2).max(18),
		firstname: z.string().max(16).optional(),
		lastname: z.string().max(16).optional(),
		name: z.string().min(2).max(18).optional(),
		avatar: z.string().optional(),
		password: z.string().min(4).max(12),
		confirm: z.string().min(4).max(12)
	})
	.superRefine(({ confirm, password }, ctx) => {
		if (confirm !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'Password and Confirm Password must match',
				path: ['password']
			});
			ctx.addIssue({
				code: 'custom',
				message: 'Password and Confirm Password must match',
				path: ['confirm']
			});
		}
	});
