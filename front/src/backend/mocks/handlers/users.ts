import { http, HttpResponse } from 'msw';

import { defaultUser, userFromToken, users } from '../data/users';
import { errorCode, fullURL, isErrCode } from '../utils';

export const handlers = [
  // john.doe@domain.tld will sign up and sign in the user
  // Any other existing users will fail
  // Any un-existing users will work to sign up but fail to sign in
  http.post(fullURL('/users'), async ({ request }) => {
    let user = userFromToken(localStorage.getItem('user_access_token'));
    if (user) {
      return HttpResponse.json(
        { message: 'user is already logged in' },
        { status: 403 },
      );
    }

    const input = (await request.json()) as { email: string; password: string };

    // Code specific triggers
    if (isErrCode(input.email)) {
      return errorCode(input.email, 'email');
    }

    // Default behavior
    user = users.find(user => user.me.email === input.email);
    if (user && user != defaultUser) {
      return HttpResponse.json(
        { message: 'already in use', field: 'email' },
        { status: 409 },
      );
    }

    return HttpResponse.json({});
  }),

  http.get(fullURL('/users/:id'), ({ params }) => {
    const user = userFromToken(localStorage.getItem('user_access_token'));
    if (!user) {
      return HttpResponse.json(
        { message: 'must be logged in' },
        { status: 401 },
      );
    }

    if (params.id !== 'me') {
      return HttpResponse.json({}, { status: 404 });
    }

    return HttpResponse.json(user.me);
  }),
];
