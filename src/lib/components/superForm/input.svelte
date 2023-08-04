<script lang="ts">
	import { capitalizeFirstLetter } from '$lib/utils';
	import { afterUpdate } from 'svelte';

	export let formObj; // superForm object
	export let name: string;
	export let placeholder: string | undefined = undefined;
	export let type: string | undefined = undefined; // cant do this because of two-binding
	export let label: string | undefined = undefined;
	export let value: string | undefined = undefined;

	let isRequired;

	const { form, errors, constraints } = formObj;

	afterUpdate(async () => {
		//
		const itemConstraint = await $constraints[name];

		if (itemConstraint?.required) {
			isRequired = itemConstraint.required;
		}
	});
	// $: console.log('$form[name]: ', $form[name]);
</script>

<div class="my-1">
	<label for={name} class=" p-0">
		<span>{label ? label : capitalizeFirstLetter(name)}</span>
		<span class="text-accent p-1">
			{isRequired ? '*' : ''}
		</span>
	</label>

	<input
		class="input input-bordered w-full max-w-md"
		class:input-error={$errors[name]}
		{name}
		type={type ? type : 'text'}
		placeholder={placeholder ?? ''}
		aria-invalid={$errors.email ? 'true' : undefined}
		value={$form[name] ?? value ?? ''}
	/>
	<!-- add this to th input for clientside validation:	{...$constraints[name]}  -->
	<label for={name} class="label text-sm text-warning p-0 pt-4 h-2 text-right w-full max-w-md">
		{#if $errors[name]}
			{$errors[name]}
		{/if}
	</label>
</div>
