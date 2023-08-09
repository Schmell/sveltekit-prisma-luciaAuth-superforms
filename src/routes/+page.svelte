<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$components/superForm';

	export let data;
	$: ({ user } = data);
</script>

<h1>Profile</h1>

<div class="flex gap-4 items-center bg-neutral-800 rounded-xl p-2 pl-4">
	<img class="rounded-full w-14 h-14 bg-neutral-content" src={user.avatar} alt={user.username} />
	<div>
		<h2 class="m-0">{user.username}</h2>
		<div class="text-xs text-secondary">{user.userId}</div>
	</div>
</div>

<div class="mt-2 text-xs text-accent">Name:</div>
<h2 class="m-0 ml-2 mb-4">{user.name}</h2>

<div class="text-xs text-accent">Email:</div>
<h4 class="m-0 ml-2 mb-4">{user.email}</h4>

<div class="divider" />
<form method="post" action="?/logout" use:enhance>
	<Button>Sign out</Button>
</form>
