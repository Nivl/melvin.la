import { User } from '#backend/api';

type testUser = {
  me: User;
  session: {
    token: string;
    refreshToken: string;
    expiresAt: string;
  };
};

export const userFromToken = (token: string | null): testUser | undefined =>
  users.find(user => user.session.token === token);

export const users: testUser[] = [
  {
    me: {
      id: 'd4349a87-9b9a-45fc-aea7-b036211aa5d7',
      name: 'John Doe',
      email: 'john.doe@domain.tld',
    },
    session: {
      token: '094b9bc8-012a-4308-923d-0047b1e9702f',
      refreshToken: '24edc5d7-f61b-4b55-aa42-21e87b4ed9bb',
      expiresAt: '2021-01-01T00:00:00.000Z',
    },
  },
  {
    me: {
      id: 'fce34594-46e6-415a-b2d7-461bd3768b11',
      name: 'New User',
      email: 'new.user@domain.tld',
    },
    session: {
      token: 'b12467c5-ec34-46a6-913f-767acf876342',
      refreshToken: 'd9b2c1df-d9a5-4ea0-8101-6ed0ce28699d',
      expiresAt: '2021-01-01T00:00:00.000Z',
    },
  },
];

export const defaultUser: testUser = users[0];
