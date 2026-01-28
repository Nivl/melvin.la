// Package internal provides various global internal utilities and configurations.
package internal

import (
	_ "embed"
	"fmt"

	"github.com/pb33f/libopenapi"
	validator "github.com/pb33f/libopenapi-validator"
	"github.com/pb33f/libopenapi-validator/config"
)

// OpenAPISpec contains the embedded OpenAPI specification.
//
//go:embed gen/openapi.yml
var OpenAPISpec []byte

// NewOpenAPISpecValidator creates a new OpenAPI specification validator
// using the embedded OpenAPI specification.
func NewOpenAPISpecValidator() (validator.Validator, error) {
	document, err := libopenapi.NewDocument(OpenAPISpec)
	if err != nil {
		return nil, fmt.Errorf("create document: %w", err)
	}

	val, errs := validator.NewValidator(document, config.WithFormatAssertions())
	if len(errs) != 0 {
		return nil, fmt.Errorf("create validator: %w", errs[0])
	}

	return val, nil
}
