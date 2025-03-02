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

// GetPostsInput represents the endpoint params needed to get posts
type GetPostsInput struct {
	After  *time.Time `json:"after"`
	Before *time.Time `json:"before"`
}

// NewGetPostsInput parses, validates, and returns the user's input
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

// GetPosts returns a paginated list of blog posts
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

	// visitors can only see published posts in order of publication,
	// logged in users (admins) can see all posts in order of creation
	//
	// This is shitty, but easier than writing an admin API
	dateFieldToUse := "created_at"
	if c.User() == nil {
		query += ` AND published_at IS NOT NULL`
		dateFieldToUse = "published_at"
	}

	switch {
	case input.After != nil:
		query += fmt.Sprintf(" AND %s > :after", dateFieldToUse)
	case input.Before != nil:
		query += fmt.Sprintf(` AND %[1]s < :before
							   ORDER BY %[1]s DESC`,
			dateFieldToUse)
	default:
		query += fmt.Sprintf(" ORDER BY %s DESC", dateFieldToUse)
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
