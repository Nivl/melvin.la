package httpendpoint

import (
	"database/sql"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/Nivl/melvin.la/api/internal/lib/errutil"
	"github.com/Nivl/melvin.la/api/internal/lib/fflag"
	"github.com/Nivl/melvin.la/api/internal/lib/httputil/httperror"
	"github.com/Nivl/melvin.la/api/internal/lib/httputil/request"
	"github.com/google/uuid"
	"github.com/jackc/pgerrcode"
	"github.com/jackc/pgx/v5/pgconn"

	dbpublic "github.com/Nivl/melvin.la/api/internal/gen/sql"
	"github.com/Nivl/melvin.la/api/internal/services/blog"
	"github.com/Nivl/melvin.la/api/internal/services/blog/payload"
	"github.com/labstack/echo/v4"
)

// UpdatePostsInput represents the endpoint params needed to update a post
type UpdatePostsInput struct {
	Title        *string              `json:"title,omitempty"`
	ContentJSON  *blog.EditorJSOutput `json:"contentJson,omitempty"`
	Description  *string              `json:"description,omitempty"`
	ThumbnailURL *string              `json:"thumbnailUrl,omitempty"`
	Slug         *string              `json:"slug,omitempty"`
	Publish      *bool                `json:"publish,omitempty"`
}

// NewUpdatePostInput parses, validates, and returns the user's input
func NewUpdatePostInput(c *request.Context, ogPost *dbpublic.BlogPost) (*UpdatePostsInput, error) {
	input := new(UpdatePostsInput)
	if err := c.Bind(input); err != nil {
		return nil, httperror.NewBadRequestError("invalid input")
	}

	// Sanitize
	if input.Title != nil {
		*input.Title = strings.TrimSpace(*input.Title)
	}
	if input.Slug != nil {
		*input.Slug = strings.TrimSpace(*input.Slug)
	}
	if input.ThumbnailURL != nil {
		*input.ThumbnailURL = strings.TrimSpace(*input.ThumbnailURL)
	}

	// Validate
	if input.Title != nil && *input.Title == "" {
		return nil, httperror.NewValidationError("title", "title is required")
	}
	// If the post is meant to be published, or is currently published
	// we need to make sure all the required fields are present
	isPublished := input.Publish == nil && ogPost.PublishedAt.Valid
	willBePublished := input.Publish != nil && *input.Publish
	if isPublished || willBePublished {
		if input.ThumbnailURL == nil || *input.ThumbnailURL == "" {
			return nil, httperror.NewValidationError("thumbnailUrl", "required when publishing")
		}
		if input.ContentJSON == nil || len(input.ContentJSON.Blocks) == 0 {
			return nil, httperror.NewValidationError("contentJson", "required when publishing")
		}
		if input.Description == nil || *input.Description == "" {
			return nil, httperror.NewValidationError("Description", "required when publishing")
		}
	}

	return input, nil
}

// UpdatePost updates a blog post
func UpdatePost(ec echo.Context) (err error) {
	c, _ := ec.(*request.Context)
	ctx := c.Request().Context()

	// TODO(melvin): Move this to a middleware after the refactor
	if !c.FeatureFlag().IsEnabled(c.Request().Context(), fflag.FlagEnableBlog, false) {
		return httperror.NewNotAvailable()
	}

	if c.User() == nil {
		return httperror.NewAuthenticationError("User not authenticated")
	}

	if err = uuid.Validate(c.Param("id")); err != nil {
		return httperror.NewValidationError("id", "invalid uuid")
	}

	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		return fmt.Errorf("could not parse ID %s: %w", c.Param("id"), err)
	}

	post, err := c.DB().GetBlogPostForUpdate(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return httperror.NewNotFoundError()
		}
		return fmt.Errorf("could not retrieve post %s: %w", c.Param("id"), err)
	}

	input, err := NewUpdatePostInput(c, post)
	if err != nil {
		return err
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
	if input.Title != nil {
		updatedFields.Title = *input.Title
		hasUpdates = true
	}
	if input.Slug != nil {
		updatedFields.Slug = *input.Slug
		hasUpdates = true
	}
	if input.ThumbnailURL != nil {
		updatedFields.ThumbnailURL = input.ThumbnailURL
		hasUpdates = true
	}
	if input.Description != nil {
		updatedFields.Description = input.Description
		hasUpdates = true
	}
	if input.ContentJSON != nil {
		updatedFields.ContentJSON = *input.ContentJSON
		hasUpdates = true
	}

	if input.Publish != nil {
		hasUpdates = hasUpdates ||
			*input.Publish != !post.PublishedAt.Valid

		post.PublishedAt.Valid = *input.Publish

		if *input.Publish && !post.PublishedAt.Valid {
			post.PublishedAt.Time = time.Now()
			post.PublishedAt.Valid = true
		}
	}

	if hasUpdates {
		tx, err := c.DB().WithTx(ctx)
		if err != nil {
			return fmt.Errorf("could not start transaction: %w", err)
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
					return httperror.NewConflictError(dbErr.ColumnName, "already in use")
				case pgerrcode.CheckViolation:
					return httperror.NewValidationError(dbErr.ColumnName, "either too short or too long")
				}
			}
			return fmt.Errorf("could not create revision for %s: %w", post.ID, err)
		}

		post, err = tx.UpdateBlogPost(ctx, updatedFields)
		if err != nil {
			return fmt.Errorf("could not update post %s: %w", post.ID, err)
		}

		err = tx.Commit(ctx)
		if err != nil {
			return fmt.Errorf("could not commit transaction: %w", err)
		}
	}

	return c.JSON(http.StatusOK, payload.NewPost(post))
}
