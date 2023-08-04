<script lang="ts">
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	// import { enhance } from '$app/forms';
	// import Button from '$lib/components/form/Button.svelte';
	import Input from '$lib/components/superForm/input.svelte';
	import Form from '$lib/components/superForm/form.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import Button from '$lib/components/form/Button.svelte';
	// export let form;
	export let data;

	const formObj = superForm(data.form);
	const { form: debug, message, errors, constraints, enhance } = formObj;
	// $: console.log('debug: ', $debug);
</script>

<h1>Email login</h1>

<form method="post" use:enhance>
	<Input name="email" {formObj} />
	<Input name="password" type="password" {formObj} />
	<Button>submit</Button>
</form>

{#if $message}
	<div>message: {$message}</div>
{/if}

<div class="flex justify-between mt-1">
	<a href="/password-reset">Reset password</a>
	<a href="/signup">Create an account</a>
</div>
<div class="divider" />
<SuperDebug data={$debug} />
<!-- <SuperDebug data={formObj?.message} /> -->
