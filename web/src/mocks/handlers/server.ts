import { setupServer } from 'msw/node';
import { handlers } from './index';

// This configures a request mocking server with the given request handlers
export const server = setupServer(...handlers);

// Export for test usage
export * from 'msw';
