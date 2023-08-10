<script lang="ts">
	import Button from '$components/form/Button.svelte';
	import { Form, Input } from '$components/superForm/index.js';
	import { superForm } from 'sveltekit-superforms/client';
	import * as flashModule from 'sveltekit-flash-message/client';
	import { getFlash } from 'sveltekit-flash-message/client';
	import { page } from '$app/stores';

	export let data;

	const flash = getFlash(page);

	const formObj = superForm(data.form, {
		autoFocusOnError: true,

		onResult: ({ result }) => {
			if (result.type === 'success') {
				console.log('result: ', result);
			}
		},

		flashMessage: {
			module: flashModule,
			onError: ({ result, message }) => {
				const errorMessage = result.error.message;
				message.set({ type: 'error', message: errorMessage });
			}
		},

		syncFlashMessage: true
	});
</script>

<svelte:head>
	<title>Reset Password - Svelte-way</title>
</svelte:head>

<h1 class="m-0">Reset password</h1>
<Form {formObj}>
	<Input name="email" {formObj} />
	<Button>Submit</Button>
	<div slot="bottomLinks"><a href="/auth/login">Sign in</a></div>
</Form>
