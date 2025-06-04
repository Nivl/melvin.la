// Package melvinla contains the code generation directives for the whole
// project
package melvinla

// generate backend API
//go:generate go tool github.com/daveshanley/vacuum bundle -q -p openapi/specs openapi/specs/openapi.yml internal/gen/openapi.yml
//go:generate go tool github.com/oapi-codegen/oapi-codegen/v2/cmd/oapi-codegen -config openapi/conf/oapi-codegen-server.yml internal/gen/openapi.yml
//go:generate go tool github.com/oapi-codegen/oapi-codegen/v2/cmd/oapi-codegen -config openapi/conf/oapi-codegen-models.yml internal/gen/openapi.yml
