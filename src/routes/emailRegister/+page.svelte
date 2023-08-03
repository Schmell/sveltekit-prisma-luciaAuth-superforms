<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/form/Button.svelte';
	import Input from '$lib/components/superForm/input.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	import { emailRegisterSchema } from './emailRegisterSchema';

	export let data;
	export let form;

	const formObj = superForm(data.form, {
		validators: emailRegisterSchema
	});

	const { form: debug } = formObj;
</script>

<h1>Email Register</h1>
<form method="post" use:enhance>
	<Input name="email" {formObj} />
	<Input name="username" {formObj} value="" />
	<!-- <Input name="name" {formObj} /> -->
	<Input name="first" label="First name" {formObj} />
	<Input name="last" label="Last name" {formObj} />

	<Input name="avatar" {formObj} />
	<Input name="password" type="password" {formObj} />
	<Input name="confirm" type="password" {formObj} />

	<Button>Register</Button>
</form>

<a href="/login">Sign in</a>
{#if form?.message}
	<div>Form message: {form?.message}</div>
{/if}
<div class="divider" />
<SuperDebug data={$debug} />
