package server

import (
	"context"

	"github.com/Nivl/melvin.la/api/internal/gen/api"
	dbpublic "github.com/Nivl/melvin.la/api/internal/gen/sql"
	"github.com/Nivl/melvin.la/api/internal/lib/httputil/request"
)

type Server struct {
	DB dbpublic.Querier
}

// we make sure the struct implements the interface
var _ api.StrictServerInterface = (*Server)(nil)

func NewServer(db dbpublic.Querier) *Server {
	return &Server{DB: db}
}

func (s *Server) GetServiceContext(ctx context.Context) *request.Context {
	return ctx.Value(api.EchoContextKey).(*request.Context)
}
