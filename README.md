# melvin.la

Source code of my personal website

## Env var

### API

| ENV | Required | Default | Info |
| --- | --- | --- | --- |
| ENVIRONMENT | optional | dev | Which env is targeted |
| API_PORT | optional | 5000 | Port to serve the API from |
| API_EXTRA_CORS_ORIGINS | optional |  | List of origins allowed by CORS |
| API_FORTNITE_API_KEY | required | required | string | | API Key for the Fortnite API |


### Frontend

| ENV | Required | Format | Default | Info |
| --- | --- | --- | --- | --- |
| NEXT_PUBLIC_API_URL | required | string | | Domain of the API |
| NEXT_PUBLIC_GCP_MAP_API_KEY | required | string | | API Key for Google map |
