<script lang="ts">
	import type { PageData } from './$types';
	import Formicator from '$lib/components/formicator/form.svelte';

	export let data: PageData;
</script>

<Formicator {data} />
