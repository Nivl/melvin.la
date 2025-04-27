package server

import (
	"context"

	"github.com/Nivl/melvin.la/api/internal/gen/api"
	"github.com/Nivl/melvin.la/api/internal/lib/httputil/httperror"
	"github.com/Nivl/melvin.la/api/internal/payload"
)

// GetUserById is a user-facing HTTP endpoint used to retrieve a user by their ID
// Or "me" to get the currently authenticated user
func (s *Server) GetUserById(ctx context.Context, input api.GetUserByIdRequestObject) (api.GetUserByIdResponseObject, error) { //nolint:revive // can't change the name, it's auto generated
	c := s.GetServiceContext(ctx)
	if c.User() == nil {
		return nil, httperror.NewAuthenticationError("user not authenticated")
	}

	// We only allow users to get themselves for now
	userID := input.ID
	if userID != "me" && userID != c.User().ID.String() {
		return nil, httperror.NewNotFoundError()
	}

	return api.GetUserById200JSONResponse(payload.NewUser(c.User())), nil
}
