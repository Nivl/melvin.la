package server

import (
	"context"

	"github.com/Nivl/melvin.la/api/internal/gen/api"
)

func (s *Server) DeleteSession(ctx context.Context, request api.DeleteSessionRequestObject) (api.DeleteSessionResponseObject, error) {
	return api.DeleteSession204Response{}, nil
}
