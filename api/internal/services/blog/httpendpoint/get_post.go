package httpendpoint

import (
	"database/sql"
	"errors"
	"fmt"
	"net/http"

	"github.com/Nivl/melvin.la/api/internal/lib/fflag"
	"github.com/Nivl/melvin.la/api/internal/lib/httputil"
	"github.com/google/uuid"

	dbpublic "github.com/Nivl/melvin.la/api/internal/gen/sql"
	"github.com/Nivl/melvin.la/api/internal/services/blog/payload"
	"github.com/Nivl/melvin.la/api/internal/uflib/ufhttputil"
	"github.com/labstack/echo/v4"
)

// GetPost returns a the blog post matching the given slug or ID
func GetPost(ec echo.Context) error {
	c, _ := ec.(*ufhttputil.Context)
	ctx := c.Request().Context()

	// TODO(melvin): Move this to a middleware after the refactor
	if !c.FeatureFlag().IsEnabled(c.Request().Context(), fflag.FlagEnableBlog, false) {
		return httputil.NewNotAvailable()
	}

	var post *dbpublic.BlogPost
	var err error
	if c.User() == nil {
		post, err = c.DB().GetPublishedBlogPost(ctx, c.Param("slug"))
	} else {
		if uuid.Validate(c.Param("slug")) == nil {
			id, err := uuid.Parse(c.Param("slug"))
			if err != nil {
				return fmt.Errorf("could not parse valid UUID %s: %w", c.Param("slug"), err)
			}
			post, err = c.DB().AdminGetBlogPost(ctx, id)
		}
	}

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return httputil.NewNotFoundError()
		}
		return fmt.Errorf("could not retrieve post: %w", err)
	}

	return c.JSON(http.StatusOK, payload.NewPost(post))
}
