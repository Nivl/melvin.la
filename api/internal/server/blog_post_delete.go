package server

import (
	"context"
	"fmt"

	"github.com/Nivl/melvin.la/api/internal/gen/api"
	"github.com/Nivl/melvin.la/api/internal/lib/fflag"
)

// DeleteBlogPost is a user-facing HTTP endpoint used to delete a blog post by
// their ID
func (s *Server) DeleteBlogPost(ctx context.Context, input api.DeleteBlogPostRequestObject) (api.DeleteBlogPostResponseObject, error) {
	c := s.GetServiceContext(ctx)

	// TODO(melvin): Move this to a middleware after the refactor
	if !c.FeatureFlag().IsEnabled(ctx, fflag.FlagEnableBlog, false) {
		return api.DeleteBlogPost503Response{}, nil
	}

	if c.User() == nil {
		return api.DeleteBlogPost401Response{}, nil
	}

	if err := c.DB().DeleteBlogPost(ctx, input.ID); err != nil {
		return nil, fmt.Errorf("could not soft-delete post: %w", err)
	}

	return api.DeleteBlogPost204Response{}, nil
}
