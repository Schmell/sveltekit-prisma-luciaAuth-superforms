<script lang="ts">
	//
	import { Form, Input } from '$lib/components/superForm';
	import { superForm } from 'sveltekit-superforms/client';
	import Button from '$lib/components/form/Button.svelte';
	import * as flashModule from 'sveltekit-flash-message/client';

	export let data;

	const formObj = superForm(data.form, {
		autoFocusOnError: true,
		flashMessage: {
			module: flashModule,
			onError: ({ result, message }) => {
				const errorMessage = result.error.message;
				message.set({ type: 'error', message: errorMessage });
			}
		},

		syncFlashMessage: true
	});

	//
</script>

<h1 class="m-0">Email login</h1>

<Form {formObj}>
	<Input name="email" type="email" {formObj} />
	<Input name="password" type="password" {formObj} />
	<Button>submit</Button>
	<div slot="bottomLinks" class="flex justify-between mt-1">
		<a href="/password-reset">Reset password</a>
		<a href="/signup">Create an account</a>
	</div>
</Form>
