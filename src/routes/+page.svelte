<script lang="ts">
	import { enhance } from '$app/forms';

	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ user } = data);
	$: console.log('user: ', user);
</script>

<h1>Profile</h1>

<div class="text-xs text-accent">Username:</div>
<div class="flex gap-4 items-center">
	<img class="rounded-full w-10 h-10" src={user.avatar} alt={user.username} />
	<div>
		<h2 class="m-0">{user.username}</h2>
		<div class="text-xs text-secondary">{user.userId}</div>
	</div>
</div>

<div class="text-xs text-accent">Name:</div>
<h2 class="m-2 mb-4">{user.name}</h2>

<div class="text-xs text-accent">Email:</div>
<h2 class="m-2">{user.email}</h2>

<div class="divider" />
<form method="post" action="?/logout" use:enhance>
	<button class="btn btn-primary w-full max-w-md" type="submit">Sign out</button>
</form>
