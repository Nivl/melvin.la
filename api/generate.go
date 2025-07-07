// Package melvinla contains the code generation directives for the whole
// project
package melvinla

// generate backend API
//go:generate vacuum bundle -q -p openapi/specs openapi/specs/openapi.yml internal/gen/openapi.yml
//go:generate oapi-codegen -config openapi/conf/oapi-codegen-server.yml internal/gen/openapi.yml
//go:generate oapi-codegen -config openapi/conf/oapi-codegen-models.yml internal/gen/openapi.yml
