import { authHandlers } from './auth.handlers';
import { dataHandlers } from './data.handlers';
import { userHandlers } from './user.handlers';

// Combine all handlers
export const handlers = [...authHandlers, ...userHandlers, ...dataHandlers];
