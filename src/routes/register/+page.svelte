<script lang="ts">
	import { enhance } from '$app/forms';
	export let form;
</script>

<h1>Register</h1>
{#if form?.message}<p class="error">{form.message}</p>{/if}
<form method="post" use:enhance>
	<label class="label" for="username">Username</label>
	<input class="input input-bordered w-full max-w-xs" name="username" id="username" /><br />
	<label class="label" for="name">Name</label>
	<input class="input input-bordered w-full max-w-xs" name="name" id="name" /><br />
	<label class="label" for="email">email</label>
	<input class="input input-bordered w-full max-w-xs" name="email" id="email" /><br />
	<label class="label" for="avatar">avatar</label>
	<input class="input input-bordered w-full max-w-xs" name="avatar" id="avatar" /><br />
	<label class="label" for="password">Password</label>
	<input
		class="input input-bordered w-full max-w-xs"
		type="password"
		name="password"
		id="password"
	/><br />
	<input class="btn mt-4" type="submit" value="submit" />
</form>
<a class="btn mt-8" href="/login">Sign in</a>
