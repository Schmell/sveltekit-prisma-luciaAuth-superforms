<script lang="ts">
	import { enhance } from '$app/forms';

	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1>Profile</h1>
<div class="text-xs text-accent">User id:</div>
<h2 class="m-2">{data.userId}</h2>
<div class="divider" />
<div class="text-xs text-accent">Username:</div>
<h2 class="m-2">{data.username}</h2>
<div class="divider" />

<form method="post" action="?/logout" use:enhance>
	<button class="btn btn-primary w-full max-w-md" type="submit">Sign out</button>
</form>
