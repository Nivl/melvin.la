// Package httperror provides a set of functions to create HTTP errors
// compatible with echo.
package httperror

import (
	"net/http"

	"github.com/Nivl/melvin.la/api/internal/lib/stringutil"
	"github.com/labstack/echo/v5"
)

// NewValidationError returns a error representing a data validation
// error.
func NewValidationError(field, message string) *echo.HTTPError {
	return echo.NewHTTPError(http.StatusBadRequest, echo.Map{
		"code":    http.StatusBadRequest,
		"message": message,
		"field":   stringutil.ToCamelCase(field),
	})
}

// NewValidationErrorWithLoc returns a error representing a data
// validation error.
// TODO(melvin): use an enum for the location
func NewValidationErrorWithLoc(field, message, location string) *echo.HTTPError {
	return echo.NewHTTPError(http.StatusBadRequest, echo.Map{
		"code":     http.StatusBadRequest,
		"message":  message,
		"field":    stringutil.ToCamelCase(field),
		"location": location,
	})
}

// NewBadRequestError returns a error representing a badly formed
// request.
func NewBadRequestError(message string) *echo.HTTPError {
	return echo.NewHTTPError(http.StatusBadRequest, echo.Map{
		"code":    http.StatusBadRequest,
		"message": message,
	})
}

// NewBadRequestErrorWithLoc returns a error representing a badly
// formed request.
func NewBadRequestErrorWithLoc(message, location string) *echo.HTTPError {
	return echo.NewHTTPError(http.StatusBadRequest, echo.Map{
		"code":     http.StatusBadRequest,
		"message":  message,
		"location": location,
	})
}

// NewConflictError returns a error representing a data conflict.
func NewConflictError(field, message string) *echo.HTTPError {
	return echo.NewHTTPError(http.StatusConflict, echo.Map{
		"code":    http.StatusConflict,
		"message": message,
		"field":   stringutil.ToCamelCase(field),
	})
}

// NewAuthenticationError returns a error representing an authentication error.
func NewAuthenticationError(message string) *echo.HTTPError {
	return echo.NewHTTPError(http.StatusUnauthorized, echo.Map{
		"code":    http.StatusUnauthorized,
		"message": message,
	})
}

// NewForbiddenError returns a error representing a permission error.
func NewForbiddenError(message string) *echo.HTTPError {
	return echo.NewHTTPError(http.StatusForbidden, echo.Map{
		"code":    http.StatusForbidden,
		"message": message,
	})
}

// NewNotFoundError returns a error representing a resource not found.
func NewNotFoundError() error {
	return echo.NewHTTPError(http.StatusNotFound, echo.Map{
		"code":    http.StatusNotFound,
		"message": "Not Found",
	})
}

// NewNotAvailable returns a error representing a resource not available.
func NewNotAvailable() error {
	return echo.NewHTTPError(http.StatusServiceUnavailable, echo.Map{
		"code":    http.StatusServiceUnavailable,
		"message": "Service Unavailable",
	})
}
