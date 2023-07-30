<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<h1>Register</h1>
<form method="post" use:enhance>
	<label for="username">Username</label>
	<input name="username" id="username" /><br />
	<label for="name">Name</label>
	<input name="name" id="name" /><br />
	<label for="email">email</label>
	<input name="email" id="email" /><br />
	<label for="avatar">avatar</label>
	<input name="avatar" id="avatar" /><br />
	<label for="password">Password</label>
	<input type="password" name="password" id="password" /><br />
	<input type="submit" />
</form>
<a href="/login">Sign in</a>
