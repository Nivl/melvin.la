package httpendpoint

import (
	"fmt"
	"net/http"

	"github.com/Nivl/melvin.la/api/internal/lib/fflag"
	"github.com/Nivl/melvin.la/api/internal/lib/httputil/httperror"
	"github.com/Nivl/melvin.la/api/internal/lib/httputil/request"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

// DeletePost soft-removes a blog post
func DeletePost(ec echo.Context) error {
	c, _ := ec.(*request.Context)
	ctx := c.Request().Context()

	// TODO(melvin): Move this to a middleware after the refactor
	if !c.FeatureFlag().IsEnabled(ctx, fflag.FlagEnableBlog, false) {
		return httperror.NewNotAvailable()
	}

	if c.User() == nil {
		return httperror.NewAuthenticationError("User not authenticated")
	}

	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		return httperror.NewValidationError("id", "not a valid uuid")
	}

	if c.DB().DeleteBlogPost(ctx, id) != nil {
		return fmt.Errorf("could not soft-delete post: %w", err)
	}

	return c.NoContent(http.StatusNoContent)
}
