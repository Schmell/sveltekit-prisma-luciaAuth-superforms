import { z } from 'zod';

export const emailRegisterSchema = z
	.object({
		username: z.string().min(2).max(18),
		name: z.string().min(2).max(18).optional(),
		firstname: z.string().max(16),
		lastname: z.string().max(16),
		avatar: z.string().optional(),
		email: z.string().email(),
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
