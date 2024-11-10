package httpendpoint

import (
	"fmt"
	"net/http"

	"github.com/Nivl/melvin.la/api/internal/lib/fflag"
	"github.com/Nivl/melvin.la/api/internal/lib/httputil"
	"github.com/Nivl/melvin.la/api/internal/uflib/ufhttputil"
	"github.com/labstack/echo/v4"
)

// DeletePost soft-removes a blog post
func DeletePost(ec echo.Context) error {
	c, _ := ec.(*ufhttputil.Context)

	// TODO(melvin): Move this to a middleware after the refactor
	if !c.FeatureFlag().IsEnabled(c.Request().Context(), fflag.FlagEnableBlog, false) {
		return httputil.NewNotFoundError()
	}

	if c.User() == nil {
		return httputil.NewAuthenticationError("User not authenticated")
	}
	query := `
		UPDATE blog_posts
			SET deleted_at = NOW()
		WHERE
			id=:id
	`
	_, err := c.DB().NamedExecContext(c.Request().Context(), query, map[string]interface{}{
		"id": c.Param("id"),
	})
	if err != nil {
		return fmt.Errorf("could not soft-delete post: %w", err)
	}

	return c.NoContent(http.StatusNoContent)
}
