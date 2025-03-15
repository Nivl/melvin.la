package httpendpoint

import (
	"fmt"
	"net/http"

	dbpublic "github.com/Nivl/melvin.la/api/internal/gen/sql"
	"github.com/Nivl/melvin.la/api/internal/lib/fflag"
	"github.com/Nivl/melvin.la/api/internal/lib/httputil"
	"github.com/jackc/pgx/v5/pgtype"

	"github.com/Nivl/melvin.la/api/internal/services/blog/payload"
	"github.com/Nivl/melvin.la/api/internal/uflib/ufhttputil"
	"github.com/labstack/echo/v4"
)

// GetPostsInput represents the endpoint params needed to get posts
type GetPostsInput struct {
	After  pgtype.Timestamptz `json:"after"`
	Before pgtype.Timestamptz `json:"before"`
}

// NewGetPostsInput parses, validates, and returns the user's input
func NewGetPostsInput(c *ufhttputil.Context) (*GetPostsInput, error) {
	input := new(GetPostsInput)
	if err := c.Bind(input); err != nil {
		return nil, httputil.NewBadRequestError("invalid input")
	}

	// Validate
	if !input.After.Valid && !input.Before.Valid {
		return nil, httputil.NewValidationError("after", "after and before cannot be used together")
	}

	return input, nil
}

// GetPosts returns a paginated list of blog posts
func GetPosts(ec echo.Context) error {
	c, _ := ec.(*ufhttputil.Context)
	ctx := c.Request().Context()

	// TODO(melvin): Move this to a middleware after the refactor
	if !c.FeatureFlag().IsEnabled(c.Request().Context(), fflag.FlagEnableBlog, false) {
		return httputil.NewNotFoundError()
	}

	input, err := NewGetPostsInput(c)
	if err != nil {
		return err
	}

	var posts []*dbpublic.BlogPost
	if c.User() == nil {
		posts, err = c.DB().
			GetPublishedBlogPosts(ctx, dbpublic.GetPublishedBlogPostsParams{
				IsBefore:   input.Before.Valid,
				BeforeDate: input.Before,
				IsAfter:    input.After.Valid,
				AfterDate:  input.After,
			})
	} else {
		posts, err = c.DB().
			AdminGetBlogPosts(ctx, dbpublic.AdminGetBlogPostsParams{
				IsBefore:   input.Before.Valid,
				BeforeDate: input.Before,
				IsAfter:    input.After.Valid,
				AfterDate:  input.After,
			})
	}
	if err != nil {
		return fmt.Errorf("could not retrieve posts: %w", err)
	}

	return c.JSON(http.StatusCreated, payload.NewPosts(posts))
}
