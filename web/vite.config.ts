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
export default defineConfig({
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
		})
	],
	server: {
		port: 3000
	},
	build: {
		outDir: 'build'
	}
});
