<script lang="ts">
	//
	import { Form, Input } from '$lib/components/superForm';
	import { superForm } from 'sveltekit-superforms/client';
	import Button from '$lib/components/form/Button.svelte';
	import * as flashModule from 'sveltekit-flash-message/client';
	import Icon from '@iconify/svelte';

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

<svelte:head>
	<title>Login - Svelte-way</title>
</svelte:head>

<h1 class="m-0">Login</h1>
<p class="m-0">Don't have an account? <a href="/register">Register</a></p>
<Form {formObj}>
	<Input name="email" type="email" {formObj} />
	<Input name="password" type="password" {formObj} />
	<Button>submit</Button>
	<div slot="bottomLinks" class="mt-1">
		<a href="/password-reset">Reset password</a>
		<!-- <a href="/signup">Create an account</a> -->
		<div class="flex flex-col gap-1">
			<a class="btn btn-ghost" href="/login/github">
				<Icon icon="fa6-brands:github" /> Sign in with Github
			</a>
			<a class="btn btn-ghost" href="/login/google">
				<Icon icon="devicon:google" /> Sign in with Google
			</a>
			<a class="btn btn-ghost" href="/login/facebook">
				<Icon icon="devicon:facebook" /> Sign in with facebook
			</a>
		</div>
	</div>
</Form>
