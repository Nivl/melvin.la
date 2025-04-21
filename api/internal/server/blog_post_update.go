package server

import (
	"context"

	"github.com/Nivl/melvin.la/api/internal/gen/api"
)

func (s *Server) UpdateBlogPost(ctx context.Context, request api.UpdateBlogPostRequestObject) (api.UpdateBlogPostResponseObject, error) {
	return api.UpdateBlogPost201JSONResponse{}, nil
}
