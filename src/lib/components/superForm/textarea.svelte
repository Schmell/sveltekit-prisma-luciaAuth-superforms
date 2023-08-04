<script lang="ts">
	import ErrorLabel from './errorLabel.svelte';
	import Label from './label.svelte';
	export let name;
	export let formObj;
	export let rows: number | undefined = undefined;

	import { cn } from '$lib/utils';
	let className: string | undefined = undefined;
	export { className as class };
	const { form } = formObj;
</script>

<Label {name} {formObj} />
<textarea class={cn('textarea textarea-bordered', className)} bind:value={$form[name]} {rows} />
<ErrorLabel {name} {formObj} />
