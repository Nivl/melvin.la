package server

import (
	"context"

	"github.com/Nivl/melvin.la/api/internal/gen/api"
)

func (s *Server) DeleteBlogPost(ctx context.Context, request api.DeleteBlogPostRequestObject) (api.DeleteBlogPostResponseObject, error) {
	return api.DeleteBlogPost204Response{}, nil
}
