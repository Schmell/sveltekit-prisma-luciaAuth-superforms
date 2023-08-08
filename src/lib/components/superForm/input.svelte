<script lang="ts">
	import { afterUpdate } from 'svelte';
	import Label from './label.svelte';
	import ErrorLabel from './errorLabel.svelte';
	import { cn } from '$lib/utils';

	export let formObj; // superForm object
	export let name: string;
	export let placeholder: string | undefined = undefined;
	export let type: string | undefined = undefined;
	export let label: string | undefined = undefined;

	let className: string | undefined = undefined;
	export { className as class };

	let isRequired;

	const { form, errors, constraints } = formObj;

	afterUpdate(async () => {
		//
		const itemConstraint = await $constraints[name];

		if (itemConstraint?.required) {
			isRequired = itemConstraint.required;
		}
	});
</script>

<div class="flex flex-col my-1">
	<Label {label} {name} {formObj} />

	{#if type === 'password'}
		<input
			class={cn('input input-bordered w-full max-w-md', className)}
			class:input-error={$errors[name]}
			{name}
			type="password"
			placeholder={placeholder ?? ''}
			aria-invalid={$errors.email ? 'true' : undefined}
			bind:value={$form[name]}
		/>
	{:else if type === 'email'}
		<input
			class={cn('input input-bordered w-full max-w-md', className)}
			class:input-error={$errors[name]}
			{name}
			type="email"
			placeholder={placeholder ?? ''}
			aria-invalid={$errors.email ? 'true' : undefined}
			bind:value={$form[name]}
		/>
	{:else}
		<input
			class={cn('input input-bordered w-full max-w-md', className)}
			class:input-error={$errors[name]}
			{name}
			placeholder={placeholder ?? ''}
			aria-invalid={$errors.email ? 'true' : undefined}
			bind:value={$form[name]}
		/>
	{/if}

	<ErrorLabel {name} {formObj} />
</div>
