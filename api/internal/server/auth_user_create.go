package server

import (
	"context"

	"github.com/Nivl/melvin.la/api/internal/gen/api"
)

func (s *Server) CreateUser(ctx context.Context, request api.CreateUserRequestObject) (api.CreateUserResponseObject, error) {
	return api.CreateUser201Response{}, nil
}
