import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { z } from 'zod';

const linkAccountSchema = z.object({});

export const load = (async ({ url }) => {
	const field = url.searchParams.get('field');
	const form = await superValidate(linkAccountSchema);
	return { form, field };
}) satisfies PageServerLoad;
