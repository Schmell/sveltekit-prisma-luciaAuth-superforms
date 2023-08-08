import { fail } from '@sveltejs/kit';
import { LuciaError } from 'lucia';
import { setError, message } from 'sveltekit-superforms/client';

export function isLuciaError(e, form) {
	if (e! instanceof LuciaError) return;
	if (e instanceof LuciaError) {
		console.log('LuciaError: ', e);

		if (e.message === 'AUTH_INVALID_PASSWORD' || e.message === 'AUTH_INVALID_KEY_ID') {
			//
			setError(form, 'email', '');
			setError(form, 'password', '');
			form.data.password = '';

			return message(form, 'Invalid Credentials', {
				status: 403
			});
		}

		form.valid = false;
		form.message = e.message;

		return fail(500, {
			message: e.message
		});
	}
}
