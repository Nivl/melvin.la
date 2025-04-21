package server

import (
	"context"

	"github.com/Nivl/melvin.la/api/internal/gen/api"
)

func (s *Server) GetUserById(ctx context.Context, request api.GetUserByIdRequestObject) (api.GetUserByIdResponseObject, error) {
	return api.GetUserById200JSONResponse{}, nil
}
