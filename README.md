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
| API_LAUNCH_DARKLY_SDK_KEY | required |  | SDK Key of Launch Darkly |

### Frontend

| ENV | Required | Format | Default | Info |
| --- | --- | --- | --- | --- |
| NEXT_PUBLIC_API_URL | required | string | | Domain of the API |
| NEXT_PUBLIC_API_MOCKING | optional | bool | flase | Whether or not use the mocked API |
| NEXT_PUBLIC_GCP_MAP_API_KEY | required | string | | API Key for Google map |
| FORTNITE_API_KEY | required | required | string | | API Key for the Fortnite API |
| NEXT_PUBLIC_FEAT_SIGN_UP | optional | bool | false | Allow/Block sign ups |
