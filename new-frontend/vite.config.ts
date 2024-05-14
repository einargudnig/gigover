import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import dynamicImport from 'vite-plugin-dynamic-import';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), dynamicImport(), ViteImageOptimizer()],
	server: {
		watch: {
			usePolling: true
		}
	}
});
