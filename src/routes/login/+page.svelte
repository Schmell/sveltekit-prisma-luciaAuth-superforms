<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<h1>Sign in</h1>
<div class="py-4">
	<form method="post" use:enhance>
		<label class="label" for="username">Username</label>
		<input class="input input-bordered w-full max-w-md" name="username" id="username" /><br />
		<label class="label" for="password">Password</label>
		<input
			class="input input-bordered w-full max-w-md"
			type="password"
			name="password"
			id="password"
		/><br />
		<button class="btn mt-4 w-full" type="submit">Login</button>
	</form>
</div>
<div class="flex flex-col">
	<a class="btn" href="/register">Create an account</a>
	<a class="btn mt-4" href="/login/github">Sign in with Github</a>
	<a class="btn mt-4" href="/login/google">Sign in with Google</a>
</div>
