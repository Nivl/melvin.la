/* eslint-disable import/no-default-export */
import createMiddleware from 'next-intl/middleware';

import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  // eslint-disable-next-line unicorn/prefer-string-raw
  matcher: '/((?!api|monitoring|_next|_vercel|.*\\..*).*)',
};
