<script>
	import { Button, Hr, Html, Text } from 'svelte-email';

	export let name = 'Unknown';
	export let link;
</script>

<Html lang="en">
	<Text>
		Hello, {name}!
	</Text>
	<Button href={link}>{link}</Button>
	<Hr />
	<Button href="https://schmelte.up.railway.app/">Go to svelte-way</Button>
</Html>
