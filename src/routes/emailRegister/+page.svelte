<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/form/Button.svelte';
	import Input from '$lib/components/superForm/input.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	import { emailRegisterSchema } from './emailRegisterSchema';
	import Form from '$lib/components/superForm/form.svelte';

	export let data;
	export let form;

	const formObj = superForm(data.form, {
		validators: emailRegisterSchema
	});

	const { form: debug, message } = formObj;
</script>

<h1>Email Register</h1>
<Form {formObj}>
	<Input name="email" {formObj} />
	<Input name="username" {formObj} value="" />
	<Input name="first" label="First name" {formObj} />
	<Input name="last" label="Last name" {formObj} />
	<Input name="avatar" {formObj} />
	<Input name="password" type="password" {formObj} />
	<Input name="confirm" type="password" {formObj} />
	<Button>Register</Button>
</Form>

<a href="/login">Sign in</a>
{#if $message}
	<div>message: {$message}</div>
{/if}
{#if form?.message}
	<div>Form message: {form?.message}</div>
{/if}
<div class="divider" />
<SuperDebug data={$debug} />
