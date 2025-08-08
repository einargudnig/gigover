import { sentryVitePlugin } from "@sentry/vite-plugin";
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig, normalizePath } from 'vite';
import svgr from 'vite-plugin-svgr';

import { viteStaticCopy } from 'vite-plugin-static-copy';

const pdfjsDistPackageUrl = new URL('pdfjs-dist/package.json', import.meta.url);
const pdfjsDistPath = dirname(fileURLToPath(pdfjsDistPackageUrl));
const cMapsDir = normalizePath(path.join(pdfjsDistPath, 'cmaps'));

// https://vitejs.dev/config/
import pkg from './package.json' assert { type: 'json' };

export default defineConfig({
	define: {
		__APP_VERSION__: JSON.stringify(pkg.version),
		__APP_ENV__: JSON.stringify(process.env.NODE_ENV || 'development')
	},
	plugins: [react(), svgr(), viteStaticCopy({
        targets: [
            {
                src: 'node_modules/pdfjs-dist/cmaps/**/*',
                dest: 'assets/pdfjs'
            }
        ]
    }), sentryVitePlugin({
        org: "gigover",
        project: "javascript-react"
    })],
	server: {
		port: 3000
	},
	build: {
		outDir: 'build',
		sourcemap: true
	}
});