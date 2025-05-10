package server

import (
	"context"
	"fmt"
	"net/http"

	"github.com/Nivl/melvin.la/api/internal/gen/api"
)

// DeleteSession is a user-facing HTTP endpoint used to delete a user session
// This is used to properly log a user out
func (s *Server) DeleteSession(ctx context.Context, _ api.DeleteSessionRequestObject) (api.DeleteSessionResponseObject, error) {
	c := s.GetServiceContext(ctx)
	if c.User() == nil {
		return api.DeleteSession401JSONResponse(*NewShortErrorResponse(http.StatusUnauthorized, "Unauthorized")), nil
	}

	err := c.DB().DeleteUserSession(ctx, c.SessionToken())
	if err != nil {
		return nil, fmt.Errorf("could not soft-delete session: %w", err)
	}
	return api.DeleteSession204Response{}, nil
}
