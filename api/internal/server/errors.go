package server

import (
	"github.com/Nivl/melvin.la/api/internal/gen/api"
	"github.com/Nivl/melvin.la/api/internal/lib/stringutil"
)

func stringPtr(s string) *string {
	return &s
}

// NewShortErrorResponse returns an ErrorResponse with only a message.
func NewShortErrorResponse(code int, message string) *api.ErrorResponse {
	return &api.ErrorResponse{ //nolint:exhaustruct // we only want a message
		Code:    code,
		Message: message,
	}
}

// NewErrorResponse returns an ErrorResponse
func NewErrorResponse(code int, field, message string, loc api.ErrorResponseLocation) *api.ErrorResponse {
	return &api.ErrorResponse{
		Code:     code,
		Message:  message,
		Field:    stringPtr(stringutil.ToCamelCase(field)),
		Location: &loc,
	}
}
