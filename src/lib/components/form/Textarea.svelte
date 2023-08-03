<script lang="ts">
	export let name: string
	export let form: any
	export let placeholder: string | undefined = undefined
	export let rows: number | undefined = undefined
	export let label: string | undefined = undefined
	// export let value
	export let errors

	function capitalizeFirstLetter(string: string) {
		return string.charAt(0).toUpperCase() + string.slice(1)
	}
</script>

<label for={name} class="label">{label ? label : capitalizeFirstLetter(name)}</label>

<textarea
	id={name}
	{name}
	{rows}
	placeholder={placeholder ?? ''}
	bind:value={$form[name]}
	class="textarea textarea-bordered mb-2  w-full max-w-md {form?.errors?.[name]
		? 'textarea-error'
		: 'textarea-bordered'}"
/>
<label for={name} class="label">
	{#if $errors[name]}
		<span class="label-text-alt text-error">{form?.errors?.[name]}</span>
	{/if}
</label>
