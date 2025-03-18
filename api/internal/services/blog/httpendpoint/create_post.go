package httpendpoint

import (
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/Nivl/melvin.la/api/internal/lib/fflag"
	"github.com/Nivl/melvin.la/api/internal/lib/httputil"
	"github.com/Nivl/melvin.la/api/internal/lib/stringutil"
	"github.com/google/uuid"
	slg "github.com/gosimple/slug"
	"github.com/jackc/pgerrcode"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgtype"

	dbpublic "github.com/Nivl/melvin.la/api/internal/gen/sql"
	"github.com/Nivl/melvin.la/api/internal/services/blog"
	"github.com/Nivl/melvin.la/api/internal/services/blog/payload"
	"github.com/Nivl/melvin.la/api/internal/uflib/ufhttputil"
	"github.com/labstack/echo/v4"
)

// CreatePostInput represents the data needed to create a new user
type CreatePostInput struct {
	Description  *string             `json:"description,omitempty"`
	Slug         *string             `json:"slug,omitempty"`
	ThumbnailURL *string             `json:"thumbnailUrl,omitempty"`
	ContentJSON  blog.EditorJSOutput `json:"contentJson"`
	Title        string              `json:"title"`
	Publish      bool                `json:"publish"`
}

// NewCreatePostInput parses, validates, and returns the user's input
func NewCreatePostInput(c *ufhttputil.Context) (*CreatePostInput, error) {
	input := new(CreatePostInput)
	if err := c.Bind(input); err != nil {
		return nil, httputil.NewBadRequestError("invalid input")
	}

	// Sanitize
	input.Title = strings.TrimSpace(input.Title)
	if input.Description != nil {
		*input.Description = strings.TrimSpace(*input.Description)
	}
	if input.Slug != nil {
		*input.Slug = strings.TrimSpace(*input.Slug)
	}
	if input.ThumbnailURL != nil {
		*input.ThumbnailURL = strings.TrimSpace(*input.ThumbnailURL)
	}

	// Validate
	if input.Title == "" {
		return nil, httputil.NewValidationError("title", "title is required")
	} else if len(input.Title) > 100 {
		return nil, httputil.NewValidationError("title", "title must be 100 chars or less")
	}

	if input.Slug != nil && len(*input.Slug) > 105 {
		return nil, httputil.NewValidationError("title", "title must be 105 chars or less")
	}

	if len(input.ContentJSON.Blocks) == 0 {
		return nil, httputil.NewValidationError("contentJson", "required")
	}

	if input.Publish {
		if input.ThumbnailURL == nil || *input.ThumbnailURL == "" {
			return nil, httputil.NewValidationError("thumbnailUrl", "required when publishing")
		} else if len(*input.ThumbnailURL) > 255 {
			return nil, httputil.NewValidationError("thumbnailUrl", "title must be 255 chars or less")
		}
		if input.Description == nil || *input.Description == "" {
			return nil, httputil.NewValidationError("description", "required when publishing")
		} else if len(*input.Description) > 130 {
			return nil, httputil.NewValidationError("description", "title must be 130 chars or less")
		}
	}

	return input, nil
}

// CreatePost lets allowed users to create a new blog post
func CreatePost(ec echo.Context) error {
	c, _ := ec.(*ufhttputil.Context)
	ctx := c.Request().Context()

	// TODO(melvin): Move this to a middleware after the refactor
	if !c.FeatureFlag().IsEnabled(c.Request().Context(), fflag.FlagEnableBlog, false) {
		return httputil.NewNotFoundError()
	}

	if c.User() == nil {
		return httputil.NewAuthenticationError("User not authenticated")
	}
	input, err := NewCreatePostInput(c)
	if err != nil {
		return err
	}

	var publishedAt pgtype.Timestamptz
	if input.Publish {
		publishedAt.Time = time.Now()
		publishedAt.Valid = true
	}

	slug := "" //nolint:wastedassign // No need to run expensive ops until we need it
	if input.Slug != nil && *input.Slug != "" {
		slug = *input.Slug
	} else {
		slug = slg.Make(input.Title) + "-" + stringutil.Random(6)
	}

	post, err := c.DB().InsertBlogPost(ctx, dbpublic.InsertBlogPostParams{
		ID:           uuid.New(),
		Title:        input.Title,
		PublishedAt:  publishedAt,
		Description:  input.Description,
		ContentJSON:  input.ContentJSON,
		ThumbnailURL: input.ThumbnailURL,
		Slug:         strings.ToLower(slug),
	})
	if err != nil {
		var dbErr *pgconn.PgError
		if errors.As(err, &dbErr) {
			switch dbErr.Code {
			case pgerrcode.UniqueViolation:
				return httputil.NewConflictError(dbErr.ColumnName, "already in use")
			case pgerrcode.CheckViolation:
				return httputil.NewValidationError(dbErr.ColumnName, "either too short or too long")
			}
		}
		return fmt.Errorf("couldn't create new post: %w", err)
	}
	return c.JSON(http.StatusCreated, payload.NewPost(post))
}
