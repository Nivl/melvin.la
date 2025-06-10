import { fn } from 'storybook/test';

import * as actual from './useSignIn';

export * from './useSignIn';
export const useSignIn = fn(actual.useSignIn).mockName('auth::useSignIn');
