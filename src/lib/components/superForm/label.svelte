<script lang="ts">
	import { capitalizeFirstLetter } from '$lib/utils';
	import { afterUpdate } from 'svelte';

	export let name: string;
	export let formObj;
	export let label: string | undefined = undefined;

	import { cn } from '$lib/utils';
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

<label for={name} class={cn(' p-0', className)}>
	<span>{label ? label : capitalizeFirstLetter(name)}</span>
	<span class="text-accent p-1">
		{isRequired ? '*' : ''}
	</span>
</label>
