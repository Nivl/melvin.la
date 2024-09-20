import { http, HttpResponse } from 'msw';

import { userFromToken, users } from '../data/users';
import { errorCode, fullURL, isErrCode } from '../utils';

export const handlers = [
  http.post(fullURL('/auth/sessions'), async ({ request }) => {
    let user = userFromToken(localStorage.getItem('user_access_token'));
    if (user) {
      return HttpResponse.json(
        { message: 'user is already logged in' },
        { status: 403 },
      );
    }

    const input = (await request.json()) as { email: string; password: string };

    if (isErrCode(input.email)) {
      return errorCode(input.email, 'email');
    }

    user = users.find(user => user.me.email === input.email);
    if (!user) {
      return HttpResponse.json(
        { message: 'Invalid email or password' },
        { status: 400 },
      );
    }

    return HttpResponse.json({
      me: user.me,
      session: user.session,
    });
  }),
];
