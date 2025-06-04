// Package server contains the implementation for the API's OAS
package server

import (
	"context"

	"github.com/Nivl/melvin.la/api/internal/gen/api"
	"github.com/Nivl/melvin.la/api/internal/lib/httputil/request"
)

// Server is the main server struct
type Server struct{}

// we make sure the struct implements the interface
var _ api.StrictServerInterface = (*Server)(nil)

// NewServer creates a new server instance
func NewServer() *Server {
	return &Server{}
}

// GetServiceContext extracts the service context from the a context.
// Panics if the context does not contain a service context.
func (s *Server) GetServiceContext(ctx context.Context) *request.Context {
	return ctx.Value(api.EchoContextKey).(*request.Context) //nolint:forcetypeassert // If it fails, the whole app is broken anyway
}

