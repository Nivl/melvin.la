package server

import (
	"context"

	"github.com/Nivl/melvin.la/api/internal/gen/api"
)

func (s *Server) GetBlogPost(ctx context.Context, request api.GetBlogPostRequestObject) (api.GetBlogPostResponseObject, error) {
	return api.GetBlogPost200JSONResponse{}, nil
}
