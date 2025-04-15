package melvinla

// generate DB models and queries
//go:generate go tool github.com/sqlc-dev/sqlc/cmd/sqlc generate

// generate backend API
//go:generate go tool github.com/daveshanley/vacuum bundle -q -p openapi/ openapi/openapi.yml internal/gen/openapi.yml
//go:generate go tool github.com/oapi-codegen/oapi-codegen/v2/cmd/oapi-codegen -config oapi-codegen.yml internal/gen/openapi.yml
