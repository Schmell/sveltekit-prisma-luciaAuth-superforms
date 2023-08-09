<script lang="ts">
	export let type: 'submit' | 'button' | 'reset' = 'submit';
	export let position: string | undefined = undefined;
	import { cn } from '$lib/utils';

	let className: string | undefined = undefined;
	export { className as class };

	// $: console.log('restProps: ', $$restProps);
</script>

{#if position === 'float'}
	<button
		{type}
		class={cn(
			'btn btn-primary mt-4 shadow-lg px-10 rounded-full fixed bottom-24 right-8',
			className
		)}
		{...$$restProps}
	>
		<slot />
	</button>
{:else}
	<button
		{type}
		class={cn('btn btn-primary mt-4 shadow-lg px-10 w-full max-w-md rounded-br-3xl', className)}
		{...$$restProps}
	>
		<slot />
	</button>
{/if}
