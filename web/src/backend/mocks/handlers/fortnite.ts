import { type OpenApiHttpHandlers } from 'openapi-msw';

import type { operations, paths } from '../../../gen/api';
import stats200 from '../../fixtures/fortnite/200.json' with { type: 'json' };
import stats400 from '../../fixtures/fortnite/400.json' with { type: 'json' };
import stats403 from '../../fixtures/fortnite/403.json' with { type: 'json' };
import stats404 from '../../fixtures/fortnite/404.json' with { type: 'json' };
import stats500 from '../../fixtures/fortnite/500.json' with { type: 'json' };

export const makeHandlers = (http: OpenApiHttpHandlers<paths>) => {
  return [
    http.get(
      '/fortnite/stats/{username}/{platform}/{timeWindow}',
      ({ params, response }) => {
        switch (params.username) {
          case '400':
            return response(400).json(
              stats400 as operations['fortniteGetStats']['responses']['400']['content']['application/json'],
            );
          case '403':
            return response(403).json(stats403);
          case '404':
            return response(404).json(stats404);
          case '500':
            return response(500).json(stats500);
          default:
            return response(200).json(stats200);
        }
      },
    ),
  ];
};
