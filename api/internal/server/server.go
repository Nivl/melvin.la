// Package server contains the implementation for the API's OAS
package server

import (
	"context"
	"net/http"
	"time"

	"github.com/Nivl/melvin.la/api/internal/gen/api"
	"github.com/Nivl/melvin.la/api/internal/lib/httpserver/request"
	"github.com/Nivl/melvin.la/api/internal/lib/secret"
)

// Server is the main server struct
// TODO(melvin): make a small Fortnite Client instead of using an HTTP client
// and passing down an API key
type Server struct {
	fortniteAPIKey secret.Secret
	http           http.Client
}

// we make sure the struct implements the interface
var _ api.StrictServerInterface = (*Server)(nil)

// NewServer creates a new server instance
func NewServer(fortniteAPIKey secret.Secret) *Server {
	return &Server{
		fortniteAPIKey: fortniteAPIKey,
		http: http.Client{
			Timeout: 3 * time.Second,
		},
	}
}

// GetServiceContext extracts the service context from the a context.
// Panics if the context does not contain a service context.
func (s *Server) GetServiceContext(ctx context.Context) *request.Context {
	return ctx.Value(api.EchoContextKey).(*request.Context) //nolint:forcetypeassert // If it fails, the whole app is broken anyway
}
