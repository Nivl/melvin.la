package server

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/Nivl/melvin.la/api/internal/gen/api"
	"github.com/Nivl/melvin.la/api/internal/lib/fflag"
	"github.com/Nivl/melvin.la/api/internal/lib/stringutil"
	"github.com/Nivl/melvin.la/api/internal/payload"
	"github.com/google/uuid"
	slg "github.com/gosimple/slug"
	"github.com/jackc/pgerrcode"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgtype"

	dbpublic "github.com/Nivl/melvin.la/api/internal/gen/sql"
)

// CreateBlogPost is a user-facing HTTP endpoint used to create a blog post
func (s *Server) CreateBlogPost(ctx context.Context, input api.CreateBlogPostRequestObject) (api.CreateBlogPostResponseObject, error) {
	c := s.GetServiceContext(ctx)

	// TODO(melvin): Move this to a middleware after the refactor
	if !c.FeatureFlag().IsEnabled(ctx, fflag.FlagEnableBlog, false) {
		return api.CreateBlogPost503JSONResponse(*NewShortErrorResponse(http.StatusServiceUnavailable, "Service Unavailable")), nil
	}

	if c.User() == nil {
		return api.CreateBlogPost401JSONResponse(*NewShortErrorResponse(http.StatusUnauthorized, "Unauthorized")), nil
	}

	errorResponse := blogPostInputSanitizerAndValidation(&BlogPostInput{
		ContentJSON:  &input.Body.ContentJson,
		Description:  input.Body.Description,
		Publish:      input.Body.Publish,
		Slug:         input.Body.Slug,
		ThumbnailURL: input.Body.ThumbnailURL,
		Title:        &input.Body.Title,
	}, dbpublic.BlogPost{}) //nolint:exhaustruct // we explicitly want an empty object with no values
	if errorResponse != nil {
		return api.CreateBlogPost400JSONResponse(*errorResponse), nil
	}

	var publishedAt pgtype.Timestamptz
	if input.Body.Publish != nil && *input.Body.Publish {
		publishedAt.Time = time.Now()
		publishedAt.Valid = true
	}

	slug := "" //nolint:wastedassign // No need to run expensive ops until we need it
	if input.Body.Slug != nil && *input.Body.Slug != "" {
		slug = *input.Body.Slug
	} else {
		slug = slg.Make(input.Body.Title) + "-" + stringutil.Random(6)
	}

	post, err := c.DB().InsertBlogPost(ctx, dbpublic.InsertBlogPostParams{
		ID:           uuid.New(),
		Title:        input.Body.Title,
		PublishedAt:  publishedAt,
		Description:  input.Body.Description,
		ContentJSON:  input.Body.ContentJson,
		ThumbnailURL: input.Body.ThumbnailURL,
		Slug:         strings.ToLower(slug),
	})
	if err != nil {
		var dbErr *pgconn.PgError
		if errors.As(err, &dbErr) {
			switch dbErr.Code {
			case pgerrcode.UniqueViolation:
				return api.CreateBlogPost409JSONResponse(*NewErrorResponse(409, dbErr.ColumnName, "already in use", api.Body)), nil
			case pgerrcode.CheckViolation:
				return api.CreateBlogPost400JSONResponse(*NewErrorResponse(400, dbErr.ColumnName, "either too short or too long", api.Body)), nil
			}
		}
		return nil, fmt.Errorf("couldn't create new post: %w", err)
	}

	return api.CreateBlogPost201JSONResponse(payload.NewBlogPost(post)), nil
}
