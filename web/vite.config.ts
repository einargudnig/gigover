import { sentryVitePlugin } from '@sentry/vite-plugin';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
import pkg from './package.json' with { type: 'json' };

export default defineConfig({
	define: {
		__APP_VERSION__: JSON.stringify(pkg.version),
		__APP_ENV__: JSON.stringify(process.env.NODE_ENV || 'development')
	},
	plugins: [
		react(),
		svgr(),
		viteStaticCopy({
			targets: [
				{
					src: 'node_modules/pdfjs-dist/cmaps/**/*',
					dest: 'assets/pdfjs'
				}
			]
		}),
		sentryVitePlugin({
			org: 'gigover',
			project: 'javascript-react'
		})
	],
	server: {
		port: 3000
	},
	build: {
		outDir: 'build',
		sourcemap: true
	}
});
