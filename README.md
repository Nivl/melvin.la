# melvin.la

Source code of my personal website

## Env var

### API

| ENV | Required | Default | Info |
| --- | --- | --- | --- |
| ENVIRONMENT | optional | dev | Which env is targeted |
| API_FEAT_SIGN_UP | required |  | Allow/Block sign ups |
| API_PORT | optional | 5000 | Port to serve the API from |
| API_POSTGRES_URL | required |  | URL of the postgress DB |
| API_EXTRA_CORS_ORIGINS | optional |  | List of origins allowed by CORS |

### Frontend

| ENV | Required | Format | Info |
| --- | --- | --- | --- |
| NEXT_PUBLIC_API_URL | required |  | Value of the `NetflixId` cookie |
| NEXT_PUBLIC_API_MOCKING | optional |  | Whether or not use the mocked API |
| NEXT_PUBLIC_GCP_MAP_API_KEY | required |  | Value of the `NetflixId` cookie |
| FORTNITE_API_KEY | required | required | API Key for the Fortnite API |
| NEXT_PUBLIC_FEAT_SIGN_UP | optional |  | Allow/Block sign ups |
