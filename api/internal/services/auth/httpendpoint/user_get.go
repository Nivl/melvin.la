package httpendpoint

import (
	"net/http"

	"github.com/Nivl/melvin.la/api/internal/lib/httputil/httperror"
	"github.com/Nivl/melvin.la/api/internal/lib/httputil/request"
	"github.com/Nivl/melvin.la/api/internal/services/auth/payload"
	"github.com/labstack/echo/v4"
)

// GetUser returns a user
func GetUser(ec echo.Context) error {
	c, _ := ec.(*request.Context)
	if c.User() == nil {
		return httperror.NewAuthenticationError("user not authenticated")
	}
	// We only allow users to get themselves
	userID := c.Param("id")
	if userID != "me" && userID != c.User().ID.String() {
		return httperror.NewNotFoundError()
	}
	return c.JSON(http.StatusOK, payload.NewMe(c.User()))
}
