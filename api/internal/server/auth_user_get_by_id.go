package server

import (
	"context"

	"github.com/Nivl/melvin.la/api/internal/gen/api"
	"github.com/Nivl/melvin.la/api/internal/lib/httputil/httperror"
	"github.com/Nivl/melvin.la/api/internal/payload"
)

func (s *Server) GetUserById(ctx context.Context, input api.GetUserByIdRequestObject) (api.GetUserByIdResponseObject, error) {
	c := s.GetServiceContext(ctx)
	if c.User() == nil {
		return nil, httperror.NewAuthenticationError("user not authenticated")
	}

	// We only allow users to get themselves for now
	userID := input.Id
	if userID != "me" && userID != c.User().ID.String() {
		return nil, httperror.NewNotFoundError()
	}

	return api.GetUserById200JSONResponse(payload.NewUser(c.User())), nil
}
