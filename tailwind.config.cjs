/** @type {import('tailwindcss').Config}*/
// import { themes } from '$lib/themes';
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},

	plugins: [require('@tailwindcss/typography'), require('daisyui')],

	daisyui: {
		themes: ['light', 'dark', 'halloween', 'bumblebee']
		// themes: themes
	}
};

module.exports = config;
