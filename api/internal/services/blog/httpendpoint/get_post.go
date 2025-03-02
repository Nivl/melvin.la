package httpendpoint

import (
	"database/sql"
	"errors"
	"fmt"
	"net/http"

	"github.com/Nivl/melvin.la/api/internal/lib/fflag"
	"github.com/Nivl/melvin.la/api/internal/lib/httputil"
	"github.com/Nivl/melvin.la/api/internal/lib/sqlutil"
	"github.com/google/uuid"

	"github.com/Nivl/melvin.la/api/internal/services/blog/models"
	"github.com/Nivl/melvin.la/api/internal/services/blog/payload"
	"github.com/Nivl/melvin.la/api/internal/uflib/ufhttputil"
	"github.com/labstack/echo/v4"
)

// GetPost returns a the blog post matching the given slug or ID
func GetPost(ec echo.Context) error {
	c, _ := ec.(*ufhttputil.Context)

	// TODO(melvin): Move this to a middleware after the refactor
	if !c.FeatureFlag().IsEnabled(c.Request().Context(), fflag.FlagEnableBlog, false) {
		return httputil.NewNotFoundError()
	}

	query := `SELECT * FROM blog_posts
			WHERE
				deleted_at IS NULL`

	if c.User() == nil {
		query += ` AND published_at IS NOT NULL`
	}

	if err := uuid.Validate(c.Param("slug")); err == nil {
		query += ` AND id = :slug`
	} else {
		query += ` AND slug = :slug`
	}
	query += ` LIMIT 1`

	post := models.Post{} //nolint:exhaustruct // Will be populated by the query
	err := sqlutil.NamedGetContext(c.Request().Context(), c.DB(), &post, query, map[string]interface{}{
		"slug": c.Param("slug"),
	})
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return httputil.NewNotFoundError()
		}
		return fmt.Errorf("could not retrieve post: %w", err)
	}

	return c.JSON(http.StatusOK, payload.NewPost(&post))
}
