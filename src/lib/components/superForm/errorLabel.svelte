<script lang="ts">
	export let name;
	export let formObj;
	import { cn } from '$lib/utils';
	let className: string | undefined = undefined;
	export { className as class };
	const { errors } = formObj;
</script>

<label
	for={name}
	class={cn(
		'flex justify-end label text-sm text-warning p-0 pt-4 h-2 text-right w-full max-w-md',
		className
	)}
>
	{#if $errors[name]}
		{$errors[name]}
	{/if}
</label>
