package middleware

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/Nivl/melvin.la/api/internal/gen/api"
	"github.com/Nivl/melvin.la/api/internal/lib/httputil/request"
	"github.com/Nivl/melvin.la/api/internal/server"
	"github.com/labstack/echo/v4"
	validator "github.com/pb33f/libopenapi-validator"
	verror "github.com/pb33f/libopenapi-validator/errors"
	vhelpers "github.com/pb33f/libopenapi-validator/helpers"
	"go.uber.org/zap"
)

func writeResponse(w http.ResponseWriter, code int, resp any) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	return json.NewEncoder(w).Encode(resp)
}

func setError(validationErrors []*verror.ValidationError, w http.ResponseWriter) error {
	// We only return the first error for simplicity
	vErr := validationErrors[0]

	// The location may be invalid (and it is in some cases)
	// We'll try to fix that later on, but it's possible for it
	// to still be wrong
	location := api.ErrorResponseLocation(vErr.ValidationType)
	field := vErr.ParameterName
	userMessage := vErr.HowToFix

	// Validates access.
	// Anything that would return a 401.
	// todo(melvin): don't hardcode the name of the field
	if vErr.ValidationType == vhelpers.SecurityValidation {
		resp := server.NewErrorResponse(http.StatusUnauthorized, "X-Api-Key", "unauthorized", api.Header)
		return writeResponse(w, http.StatusUnauthorized, resp)
	}

	// Validates path existence.
	// Anything that would return a 404.
	if vErr.ValidationType == vhelpers.Path {
		resp := server.NewShortErrorResponse(http.StatusNotFound, "not found")
		return writeResponse(w, http.StatusNotFound, resp)
	}

	// Validates the body, query params, path params, etc.
	// anything that would return a 400.
	switch vErr.ValidationType {
	// body
	case vhelpers.RequestBodyValidation:
		location = api.Body
		if len(vErr.SchemaValidationErrors) > 0 {
			field = vErr.SchemaValidationErrors[0].FieldName
			userMessage = vErr.SchemaValidationErrors[0].Reason
		}
	// this is for headers, query params, path params, and cookies
	case vhelpers.ParameterValidation:
		location = api.ErrorResponseLocation(vErr.ValidationSubType)
	}
	resp := server.NewErrorResponse(http.StatusBadRequest, field, userMessage, location)
	return writeResponse(w, http.StatusBadRequest, resp)
}

// Validation is a middleware that validates the requests and responses
// based on the OpenAPI specification.
func Validation(v validator.Validator) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(ec echo.Context) error {
			c, _ := ec.(*request.Context)

			isValid, validationErrors := v.ValidateHttpRequest(ec.Request())
			if !isValid {
				if len(validationErrors) == 0 {
					return fmt.Errorf("request validation failed but no errors were returned")
				}
				err := setError(validationErrors, ec.Response())
				// We already wrote the response partially, so there is not much
				// we can do but log the error.
				if err != nil {
					c.Log().Error("failed to write validation error response", zap.Error(err))
				}
				return nil
			}

			return next(ec)
		}
	}
}
