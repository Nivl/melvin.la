package melvinla

// generate DB models and queries
//go:generate go tool github.com/sqlc-dev/sqlc/cmd/sqlc generate

// generate backend API
//go:generate go tool github.com/daveshanley/vacuum bundle -q -p openapi/specs openapi/specs/openapi.yml internal/gen/openapi.yml
//go:generate go tool github.com/oapi-codegen/oapi-codegen/v2/cmd/oapi-codegen -config openapi/conf/oapi-codegen-server.yml internal/gen/openapi.yml
//go:generate go tool github.com/oapi-codegen/oapi-codegen/v2/cmd/oapi-codegen -config openapi/conf/oapi-codegen-models.yml internal/gen/openapi.yml
