package httpendpoint

import (
	"fmt"
	"net/http"
	"time"

	"github.com/Nivl/melvin.la/api/internal/lib/fflag"
	"github.com/Nivl/melvin.la/api/internal/lib/httputil"
	"github.com/Nivl/melvin.la/api/internal/lib/sqlutil"

	"github.com/Nivl/melvin.la/api/internal/services/blog/models"
	"github.com/Nivl/melvin.la/api/internal/services/blog/payload"
	"github.com/Nivl/melvin.la/api/internal/uflib/ufhttputil"
	"github.com/labstack/echo/v4"
)

type GetPostsInput struct {
	After  *time.Time `json:"after"`
	Before *time.Time `json:"before"`
}

func NewGetPostsInput(c *ufhttputil.Context) (*GetPostsInput, error) {
	input := new(GetPostsInput)
	if err := c.Bind(input); err != nil {
		return nil, httputil.NewBadRequestError("invalid input")
	}

	// Validate
	if input.After != nil && input.Before != nil {
		return nil, httputil.NewValidationError("after", "after and before cannot be used together")
	}

	return input, nil
}

// GetPosts returns all the blog posts to users
func GetPosts(ec echo.Context) error {
	c, _ := ec.(*ufhttputil.Context)

	// TODO(melvin): Move this to a middleware after the refactor
	if !c.FeatureFlag().IsEnabled(c.Request().Context(), fflag.FlagEnableBlog, false) {
		return httputil.NewNotFoundError()
	}

	input, err := NewGetPostsInput(c)
	if err != nil {
		return err
	}

	query := `SELECT * FROM blog_posts
			WHERE
				deleted_at IS NULL`

	switch c.User() {
	case nil:
		query += ` AND published_at IS NOT NULL`
		if input.After != nil {
			query += ` AND published_at > :after`
		} else if input.Before != nil {
			query += ` AND published_at < :before
				ORDER BY published_at DESC`
		} else {
			query += ` ORDER BY published_at DESC`
		}
	default:
		if input.After != nil {
			query += ` AND created_at > :after`
		} else if input.Before != nil {
			query += ` AND created_at < :before
				ORDER BY created_at DESC`
		} else {
			query += ` ORDER BY published_at DESC`
		}
	}
	query += ` LIMIT 100`

	posts := []*models.Post{}
	err = sqlutil.NamedSelectContext(c.Request().Context(), c.DB(), &posts, query, map[string]interface{}{
		"after":  input.After,
		"before": input.Before,
	})
	if err != nil {
		return fmt.Errorf("could not retrieve posts: %w", err)
	}

	return c.JSON(http.StatusCreated, payload.NewPosts(posts))
}
