import { setupWorker } from 'msw/browser';
import { handlers } from './index';

// This configures a Service Worker with the given request handlers
export const worker = setupWorker(...handlers);

// Export convenience methods for using the worker
export const startMsw = () => worker.start();
