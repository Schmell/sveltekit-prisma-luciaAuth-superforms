<script lang="ts">
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	// import { enhance } from '$app/forms';
	// import Button from '$lib/components/form/Button.svelte';
	import Input from '$lib/components/superForm/input.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import Button from '$lib/components/form/Button.svelte';

	export let data;

	const formObj = superForm(data.form);
	const { form, errors, constraints, enhance } = formObj;
</script>

<h1>Email login</h1>

<form class="flex flex-col" method="post" use:enhance>
	<Input name="email" {formObj} />
	<Input name="password" type="password" {formObj} />
	<Button>submit</Button>
</form>

<div class="flex justify-between mt-1">
	<a href="/password-reset">Reset password</a>
	<a href="/signup">Create an account</a>
</div>
<div class="divider" />
<SuperDebug data={$form} />
