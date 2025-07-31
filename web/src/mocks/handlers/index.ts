import { authHandlers } from './auth.handlers';
import { dataHandlers } from './data.handlers';
import { taskHandlers } from './task.handlers';
import { userHandlers } from './user.handlers';

// Combine all handlers
export const handlers = [...authHandlers, ...userHandlers, ...dataHandlers, ...taskHandlers];
