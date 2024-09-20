import { handlers as authHandlers } from './auth';
import { handlers as userHandlers } from './users';

export const handlers = [...userHandlers, ...authHandlers];
