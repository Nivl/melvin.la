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
	"github.com/Nivl/melvin.la/api/internal/lib/httputil"
	"github.com/Nivl/melvin.la/api/internal/lib/sqlutil"

	"github.com/Nivl/melvin.la/api/internal/services/blog"
	"github.com/Nivl/melvin.la/api/internal/services/blog/models"
	"github.com/Nivl/melvin.la/api/internal/services/blog/payload"
	"github.com/Nivl/melvin.la/api/internal/uflib/ufhttputil"
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
func NewUpdatePostInput(c *ufhttputil.Context, ogPost *models.Post) (*UpdatePostsInput, error) {
	input := new(UpdatePostsInput)
	if err := c.Bind(input); err != nil {
		return nil, httputil.NewBadRequestError("invalid input")
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
		return nil, httputil.NewValidationError("title", "title is required")
	}
	// If the post is meant to be published, or is currently published
	// we need to make sure all the required fields are present
	isPublished := input.Publish == nil && ogPost.PublishedAt != nil
	willBePublished := input.Publish != nil && *input.Publish
	if isPublished || willBePublished {
		if input.ThumbnailURL == nil || *input.ThumbnailURL == "" {
			return nil, httputil.NewValidationError("thumbnailUrl", "required when publishing")
		}
		if input.ContentJSON == nil || len(input.ContentJSON.Blocks) == 0 {
			return nil, httputil.NewValidationError("contentJson", "required when publishing")
		}
		if input.Description == nil || *input.Description == "" {
			return nil, httputil.NewValidationError("Description", "required when publishing")
		}
	}

	return input, nil
}

// UpdatePost updates a blog post
func UpdatePost(ec echo.Context) (err error) {
	c, _ := ec.(*ufhttputil.Context)

	// TODO(melvin): Move this to a middleware after the refactor
	if !c.FeatureFlag().IsEnabled(c.Request().Context(), fflag.FlagEnableBlog, false) {
		return httputil.NewNotFoundError()
	}

	if c.User() == nil {
		return httputil.NewAuthenticationError("User not authenticated")
	}

	query := `SELECT * FROM blog_posts
	WHERE id = :idOrSlug OR slug = :idOrSlug`
	post := &models.Post{} //nolint:exhaustruct // Will be populated by the query
	err = sqlutil.NamedGetContext(c.Request().Context(), c.DB(), post, query, map[string]interface{}{
		"idOrSlug": c.Param("id"),
	})
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return httputil.NewNotFoundError()
		}
		return fmt.Errorf("could not retrieve post %s: %w", c.Param("id"), err)
	}

	input, err := NewUpdatePostInput(c, post)
	if err != nil {
		return err
	}

	tx, err := c.DB().BeginTxx(c.Request().Context(), &sql.TxOptions{})
	if err != nil {
		return fmt.Errorf("could not start transaction: %w", err)
	}
	defer errutil.CheckWhenErr(tx.Rollback, &err, "could not rollback transaction")

	rev := models.NewRevision(post)

	if input.Title != nil {
		post.Title = *input.Title
	}
	if input.Slug != nil {
		post.Slug = *input.Slug
	}
	if input.ThumbnailURL != nil {
		post.ThumbnailURL = input.ThumbnailURL
	}
	if input.Description != nil {
		post.Description = input.Description
	}
	if input.ContentJSON != nil {
		post.ContentJSON = input.ContentJSON
	}

	// We only want to create a new revision if the actual
	// content of the post has changed
	// We don't create revision for changes such as publish/unpublish
	if rev.Post != *post {
		_, err = rev.Insert(c.Request().Context(), tx)
		if err != nil {
			return fmt.Errorf("could not create revision for %s: %w", post.ID, err)
		}
	}

	if input.Publish != nil {
		if *input.Publish && post.PublishedAt == nil {
			now := time.Now()
			post.PublishedAt = &now
		} else {
			post.PublishedAt = nil
		}
	}

	_, err = post.Update(c.Request().Context(), tx)
	if err != nil {
		return fmt.Errorf("could not update post %s: %w", post.ID, err)
	}

	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("could not commit transaction: %w", err)
	}
	return c.JSON(http.StatusOK, payload.NewPost(post))
}
