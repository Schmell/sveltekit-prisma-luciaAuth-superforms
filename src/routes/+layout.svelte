<script>
	import '../app.postcss';
	import { page } from '$app/stores';
	import { getFlash } from 'sveltekit-flash-message/client';

	const flash = getFlash(page);
	$: console.log('flash: ', $flash);
</script>

{#if $flash}
	{@const bg = $flash.type === 'success' ? '#3D9970' : '#FF4136'}
	<div style:background-color={bg} class="flash">{$flash.message}</div>
{/if}
<div class="prose m-8">
	<slot />
</div>
