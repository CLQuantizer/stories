import adapter from "@sveltejs/adapter-cloudflare";
import {vitePreprocess} from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
export default {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			// See below for an explanation of these options
			routes: {
				include: ['/*'],
				exclude: ['<all>']
			}
		}),
		alias: {
			"@/*": "./path/to/lib/*",
		},
	}
};