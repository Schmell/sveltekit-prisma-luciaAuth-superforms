<script lang="ts">
	import Input from '$lib/components/superForm/input.svelte';
	import { superForm } from 'sveltekit-superforms/client';

	import { emailRegisterSchema } from './emailRegisterSchema';
	import { Form, Button } from '$lib/components/superForm';

	export let data;

	const formObj = superForm(data.form, {
		validators: emailRegisterSchema,
		autoFocusOnError: true
	});
</script>

<svelte:head>
	<title>Register - Svelte-way</title>
</svelte:head>

<h1 class="m-0">Email Register</h1>
<p class="m-0">Already have an account? <a href="/auth/login">Login</a></p>
<Form {formObj}>
	<Input name="email" type="email" {formObj} />
	<Input name="username" {formObj} />
	<Input name="firstname" label="First name" {formObj} />
	<Input name="lastname" label="Last name" {formObj} />
	<Input name="avatar" {formObj} />
	<Input name="password" type="password" {formObj} />
	<Input name="confirm" type="password" label="Confirm password" {formObj} />
	<Button>Register</Button>
	<svelte:fragment slot="bottomLinks"><a href="/auth/login">Login</a></svelte:fragment>
</Form>
