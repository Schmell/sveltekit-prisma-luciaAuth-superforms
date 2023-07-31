<script lang="ts">
	import { enhance } from '$app/forms';
	export let form;
</script>

<h1>Register</h1>
<p>ALready have an account? <a href="/login">Login</a></p>
{#if form?.message}<p class="error">{form.message}</p>{/if}
<form method="post" use:enhance>
	<label class="label" for="username">Username</label>
	<input class="input input-bordered w-full max-w-md" name="username" id="username" /><br />
	<label class="label" for="name">Name</label>
	<input class="input input-bordered w-full max-w-md" name="name" id="name" /><br />
	<label class="label" for="email">email</label>
	<input class="input input-bordered w-full max-w-md" name="email" id="email" /><br />
	<label class="label" for="avatar">avatar</label>
	<input class="input input-bordered w-full max-w-md" name="avatar" id="avatar" /><br />
	<label class="label" for="password">Password</label>
	<input
		class="input input-bordered w-full max-w-md"
		type="password"
		name="password"
		id="password"
	/><br />
	<input class="btn btn-primary mt-6 w-full max-w-md" type="submit" value="Register" />
</form>
