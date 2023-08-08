<script lang="ts">
	import Button from '$lib/components/form/Button.svelte';
	import Input from '$lib/components/superForm/input.svelte';
	import { superForm } from 'sveltekit-superforms/client';

	import { emailRegisterSchema } from './emailRegisterSchema';
	import Form from '$lib/components/superForm/form.svelte';

	export let data;

	const formObj = superForm(data.form, {
		validators: emailRegisterSchema,
		autoFocusOnError: true
	});
</script>

<h1 class="m-0">Email Register</h1>
<p class="m-0">Already have an account? <a href="/login">Login</a></p>
<Form {formObj}>
	<Input name="email" type="email" {formObj} />
	<Input name="username" {formObj} />
	<Input name="firstname" label="First name" {formObj} />
	<Input name="lastname" label="Last name" {formObj} />
	<Input name="avatar" {formObj} />
	<Input name="password" type="password" {formObj} />
	<Input name="confirm" type="password" label="Confirm password" {formObj} />
	<Button>Register</Button>
	<div slot="bottomLinks"><a href="/emailLogin">Sign in with email</a></div>
</Form>
