<script lang="ts">
	import Icon from '@iconify/svelte';
	import { enhance } from '$app/forms';
	export let form;
</script>

<h1 class="mb-0">Login</h1>
<p>Don't have an account? <a href="/register">Register here</a></p>
{#if form?.message}
	<p class="text-error">{form.message}</p>
{/if}
<div class="pb-4">
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
		<button class="btn btn-primary mt-8 w-full" type="submit">Login</button>
	</form>
</div>
<div class="flex flex-col gap-1">
	<a class="btn btn-ghost" href="/login/github">
		<Icon icon="fa6-brands:github" /> Sign in with Github
	</a>
	<a class="btn btn-ghost" href="/login/google">
		<Icon icon="devicon:google" /> Sign in with Google
	</a>
	<a class="btn btn-ghost" href="/login/google">
		<Icon icon="devicon:facebook" /> Sign in with facebook
	</a>
</div>
