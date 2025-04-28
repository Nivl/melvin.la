package server

import (
	"github.com/Nivl/melvin.la/api/internal/gen/api"
	"github.com/Nivl/melvin.la/api/internal/lib/stringutil"
)

func stringPtr(s string) *string {
	return &s
}

// NewShortErrorResponse returns an ErrorResponse with only a message.
func NewShortErrorResponse(message string) *api.ErrorResponse {
	return &api.ErrorResponse{ //nolint:exhaustruct // we only want a message
		Message: message,
	}
}

// NewErrorResponse returns an ErrorResponse
func NewErrorResponse(field, message string, loc api.ErrorResponseLocation) *api.ErrorResponse {
	return &api.ErrorResponse{
		Message:  message,
		Field:    stringPtr(stringutil.ToCamelCase(field)),
		Location: &loc,
	}
}
