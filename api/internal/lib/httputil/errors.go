package httputil

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// NewValidationError returns a error representing a data validation
// error.
func NewValidationError(field, message string) *echo.HTTPError {
	return echo.NewHTTPError(http.StatusBadRequest, echo.Map{
		"message": message,
		"field":   field,
	})
}

// NewBadRequestError returns a error representing a badly formed
// request.
func NewBadRequestError(message string) *echo.HTTPError {
	return echo.NewHTTPError(http.StatusBadRequest, echo.Map{
		"message": message,
	})
}

// NewConflictError returns a error representing a data conflict.
func NewConflictError(field, message string) *echo.HTTPError {
	return echo.NewHTTPError(http.StatusConflict, echo.Map{
		"message": message,
		"field":   field,
	})
}

// NewAuthenticationError returns a error representing an authentication error.
func NewAuthenticationError(message string) *echo.HTTPError {
	return echo.NewHTTPError(http.StatusUnauthorized, echo.Map{
		"message": message,
	})
}

// NewForbiddenError returns a error representing a permission error.
func NewForbiddenError(message string) *echo.HTTPError {
	return echo.NewHTTPError(http.StatusForbidden, echo.Map{
		"message": message,
	})
}

// NewNotFoundError returns a error representing a resource not found.
func NewNotFoundError() error {
	return echo.NewHTTPError(http.StatusNotFound)
}
