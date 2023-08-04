<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SuperForm } from 'sveltekit-superforms/client';

	export let formObj;
	const { form: debug, message } = formObj;
	$: console.log('formObj: ', formObj);
</script>

<form method="post" use:enhance>
	{#if $message}
		<div>message: {$message}</div>
	{/if}

	{#if $debug?.message}
		<div>Form message: {$debug?.message}</div>
	{/if}

	<slot />
</form>
