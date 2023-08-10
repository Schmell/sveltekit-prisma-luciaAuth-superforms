<script lang="ts">
	import { enhance } from '$app/forms';

	export let data;
	$: console.log('data: ', data);
</script>

<form method="post" use:enhance>
	<slot />
</form>
