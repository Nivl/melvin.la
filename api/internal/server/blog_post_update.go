package server

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/Nivl/melvin.la/api/internal/gen/api"
	dbpublic "github.com/Nivl/melvin.la/api/internal/gen/sql"
	"github.com/Nivl/melvin.la/api/internal/lib/errutil"
	"github.com/Nivl/melvin.la/api/internal/lib/fflag"
	"github.com/Nivl/melvin.la/api/internal/payload"
	"github.com/google/uuid"
	"github.com/jackc/pgerrcode"
	"github.com/jackc/pgx/v5/pgconn"
)

// UpdateBlogPost is a user-facing HTTP endpoint that updates a blog post
func (s *Server) UpdateBlogPost(ctx context.Context, input api.UpdateBlogPostRequestObject) (api.UpdateBlogPostResponseObject, error) {
	c := s.GetServiceContext(ctx)

	// TODO(melvin): Move this to a middleware after the refactor
	if !c.FeatureFlag().IsEnabled(ctx, fflag.FlagEnableBlog, false) {
		return api.UpdateBlogPost503Response{}, nil
	}

	if c.User() == nil {
		return api.UpdateBlogPost401Response{}, nil
	}

	post, err := c.DB().GetBlogPostForUpdate(ctx, input.ID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return api.UpdateBlogPost404Response{}, nil
		}
		return nil, fmt.Errorf("could not retrieve post %s: %w", input.ID, err)
	}

	errorResponse := blogPostInputSanitizerAndValidation(&BlogPostInput{
		ContentJSON:  input.Body.ContentJson,
		Description:  input.Body.Description,
		Publish:      input.Body.Publish,
		Slug:         input.Body.Slug,
		ThumbnailURL: input.Body.ThumbnailURL,
		Title:        input.Body.Title,
	}, *post)
	if errorResponse != nil {
		return api.UpdateBlogPost400JSONResponse(*errorResponse), nil
	}

	hasUpdates := false
	updatedFields := dbpublic.UpdateBlogPostParams{
		ID:           post.ID,
		Title:        post.Title,
		Slug:         post.Slug,
		ContentJSON:  post.ContentJSON,
		ThumbnailURL: post.ThumbnailURL,
		Description:  post.Description,
		PublishedAt:  post.PublishedAt,
	}
	if input.Body.Title != nil {
		updatedFields.Title = *input.Body.Title
		hasUpdates = true
	}
	if input.Body.Slug != nil {
		updatedFields.Slug = *input.Body.Slug
		hasUpdates = true
	}
	if input.Body.ThumbnailURL != nil {
		updatedFields.ThumbnailURL = input.Body.ThumbnailURL
		hasUpdates = true
	}
	if input.Body.Description != nil {
		updatedFields.Description = input.Body.Description
		hasUpdates = true
	}
	if input.Body.ContentJson != nil {
		updatedFields.ContentJSON = *input.Body.ContentJson
		hasUpdates = true
	}

	if input.Body.Publish != nil {
		hasUpdates = hasUpdates ||
			*input.Body.Publish != !post.PublishedAt.Valid

		post.PublishedAt.Valid = *input.Body.Publish

		if *input.Body.Publish && !post.PublishedAt.Valid {
			post.PublishedAt.Time = time.Now()
			post.PublishedAt.Valid = true
		}
	}

	if hasUpdates {
		tx, err := c.DB().WithTx(ctx)
		if err != nil {
			return nil, fmt.Errorf("could not start transaction: %w", err)
		}
		defer errutil.RunOnErrWithCtx(ctx, tx.Rollback, err, "could not rollback transaction")

		_, err = tx.InsertBlogPostRev(ctx, dbpublic.InsertBlogPostRevParams{
			ID:           uuid.New(),
			BlogPostID:   post.ID,
			Title:        post.Title,
			Slug:         post.Slug,
			ContentJSON:  post.ContentJSON,
			ThumbnailURL: post.ThumbnailURL,
			Description:  post.Description,
		})
		if err != nil {
			var dbErr *pgconn.PgError
			if errors.As(err, &dbErr) {
				switch dbErr.Code {
				case pgerrcode.UniqueViolation:
					return api.UpdateBlogPost409JSONResponse(*NewErrorResponse(dbErr.ColumnName, "already in use", api.Body)), nil
				case pgerrcode.CheckViolation:
					return api.UpdateBlogPost400JSONResponse(*NewErrorResponse(dbErr.ColumnName, "either too short or too long", api.Body)), nil
				}
			}
			return nil, fmt.Errorf("could not create revision for %s: %w", post.ID, err)
		}

		post, err = tx.UpdateBlogPost(ctx, updatedFields)
		if err != nil {
			return nil, fmt.Errorf("could not update post %s: %w", post.ID, err)
		}

		err = tx.Commit(ctx)
		if err != nil {
			return nil, fmt.Errorf("could not commit transaction: %w", err)
		}
	}

	return api.UpdateBlogPost200JSONResponse(payload.NewBlogPost(post)), nil
}
