import { join } from 'path';
import tailwindcssAnimate from 'tailwindcss-animate';
import plugin from 'tailwindcss/plugin';
import { skeleton } from '@skeletonlabs/tw-plugin';
// import { themeDarc } from './src/themes/darc';
import typography from '@tailwindcss/typography';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
const config = {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {}
	},
	plugins: [
		skeleton({
			themes: { preset: ['gold-nouveau'] /* custom: [themeDarc] */ }
		}),
		forms,
		typography,
		tailwindcssAnimate,
		plugin(({ matchUtilities }) => {
			matchUtilities({
				vtn: (value) => {
					return {
						'view-transition-name': value
					};
				}
			});
		})
	]
};

export default config;
