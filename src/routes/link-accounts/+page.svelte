<script lang="ts">
	import { Form } from '$components/superForm';

	import { superForm } from 'sveltekit-superforms/client';
	import * as flashModule from 'sveltekit-flash-message/client';
	import Button from '$components/form/Button.svelte';

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
</script>

{#if data.field === 'email'}
	<h1>Link your accounts</h1>

	<p>A user with the assoicated email is alreay registered.</p>
	<p>Would you like to link these accounts together</p>
	<Form {formObj}>
		<Button class="btn btn-primary w-full max-w-md">Send verification email</Button>
	</Form>
{/if}
{#if data.field === 'username'}
	<h1>Username already exists</h1>
{/if}
