import { isMswEnabled } from './utils/toggle-msw';

// Initialize MSW in development environment

async function initMocks() {
	if (process.env.NODE_ENV === 'development' && isMswEnabled()) {
		const { worker } = await import('./handlers/browser');
		// Start the worker with specified options
		return worker.start({
			onUnhandledRequest: 'bypass' // 'warn' | 'error' | 'bypass'
		});
	}
	return Promise.resolve();
}

export default initMocks;
