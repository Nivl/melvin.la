package httpendpoint

import (
	"net/http"

	"github.com/Nivl/melvin.la/api/internal/lib/httputil"
	"github.com/Nivl/melvin.la/api/internal/services/auth/payload"
	"github.com/Nivl/melvin.la/api/internal/uflib/ufhttputil"
	"github.com/labstack/echo/v4"
)

// GetUser returns a user
func GetUser(ec echo.Context) error {
	c, _ := ec.(*ufhttputil.Context)
	if c.User() == nil {
		return httputil.NewAuthenticationError("user not authenticated")
	}
	// We only allow users to get themselves
	userID := c.Param("id")
	if userID != "me" && userID != c.User().ID {
		return httputil.NewNotFoundError()
	}
	return c.JSON(http.StatusOK, payload.NewMe(c.User()))
}
