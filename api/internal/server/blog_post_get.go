package server

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"net/http"

	"github.com/Nivl/melvin.la/api/internal/gen/api"
	dbpublic "github.com/Nivl/melvin.la/api/internal/gen/sql"
	"github.com/Nivl/melvin.la/api/internal/lib/fflag"
	"github.com/Nivl/melvin.la/api/internal/payload"
	"github.com/google/uuid"
)

// GetBlogPost is a user-facing HTTP endpoint used to retrieve a blog post by
// their ID or slug
// To get a blog post by ID, the user must be authenticated
func (s *Server) GetBlogPost(ctx context.Context, input api.GetBlogPostRequestObject) (api.GetBlogPostResponseObject, error) {
	c := s.GetServiceContext(ctx)

	if !c.FeatureFlag().IsEnabled(ctx, fflag.FlagEnableBlog, false) {
		return api.GetBlogPost503JSONResponse(*NewShortErrorResponse(http.StatusServiceUnavailable, "Service Unavailable")), nil
	}

	var post *dbpublic.BlogPost
	var err error

	// If the user is not authenticated, we expect a slug
	// If the user is authenticated, we expect an ID
	// This is because we assume that a user is an admin and can access
	// more content
	// TODO(melvin): Don't merge admin and public endpoints
	if c.User() == nil {
		post, err = c.DB().GetPublishedBlogPost(ctx, input.IdOrSlug)
	} else {
		if uuid.Validate(input.IdOrSlug) != nil {
			return api.GetBlogPost400JSONResponse(*NewErrorResponse(http.StatusBadRequest, "idOrSlug", "expects a UUID", api.Path)), nil //nolint:nilerr // The error is returned in the response (user-error), and not as an error (system-error)
		}

		var id uuid.UUID
		id, err = uuid.Parse(input.IdOrSlug)
		if err != nil {
			return nil, fmt.Errorf("could not parse valid UUID %s: %w", input.IdOrSlug, err)
		}
		post, err = c.DB().AdminGetBlogPost(ctx, id)
	}

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return api.GetBlogPost404JSONResponse(*NewShortErrorResponse(http.StatusNotFound, "Not Found")), nil
		}
		return nil, fmt.Errorf("could not retrieve post: %w", err)
	}

	return api.GetBlogPost200JSONResponse(payload.NewBlogPost(post)), nil
}
