package server

import (
	"context"

	"github.com/Nivl/melvin.la/api/internal/gen/api"
)

func (s *Server) CreateBlogPost(ctx context.Context, request api.CreateBlogPostRequestObject) (api.CreateBlogPostResponseObject, error) {
	return api.CreateBlogPost201JSONResponse{}, nil
}
