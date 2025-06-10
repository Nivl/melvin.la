import { fn } from 'storybook/test';

import * as actual from './useSignUp';

export * from './useSignUp';
export const useSignUp = fn(actual.useSignUp).mockName('auth::useSignUp');
