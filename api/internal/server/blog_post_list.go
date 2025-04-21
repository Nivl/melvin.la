package server

import (
	"context"

	"github.com/Nivl/melvin.la/api/internal/gen/api"
)

func (s *Server) GetBlogPosts(ctx context.Context, request api.GetBlogPostsRequestObject) (api.GetBlogPostsResponseObject, error) {
	return api.GetBlogPosts200JSONResponse{}, nil
}
