import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

// Name has a default value just to display something in the form.
const schema = z.object({
	name: z.string().default('Hello world!'),
	email: z.string().email()
});

export async function load() {
	const form = await superValidate(schema);
	return { form };
}
