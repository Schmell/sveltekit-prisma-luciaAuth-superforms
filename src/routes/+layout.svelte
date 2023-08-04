<script>
	import '../app.postcss';
	import { page } from '$app/stores';
	import { getFlash } from 'sveltekit-flash-message/client';

	const flash = getFlash(page);
	$: console.log('flash: ', $flash);
</script>

<div class="prose m-8">
	<slot />
</div>
