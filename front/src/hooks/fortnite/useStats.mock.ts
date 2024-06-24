import { fn } from '@storybook/test';

import * as actual from './useStats';

export * from './useStats';
export const useStats = fn(actual.useStats).mockName('fortnite::useStats');
