package server

import (
	"context"
	"fmt"

	"github.com/Nivl/melvin.la/api/internal/gen/api"
	"github.com/Nivl/melvin.la/api/internal/lib/httputil/httperror"
)

func (s *Server) DeleteSession(ctx context.Context, input api.DeleteSessionRequestObject) (api.DeleteSessionResponseObject, error) {
	c := s.GetServiceContext(ctx)
	if c.User() == nil {
		return nil, httperror.NewAuthenticationError("user not authenticated")
	}

	err := c.DB().DeleteUserSession(ctx, c.SessionToken())
	if err != nil {
		return nil, fmt.Errorf("could not soft-delete session: %w", err)
	}
	return api.DeleteSession204Response{}, nil
}
