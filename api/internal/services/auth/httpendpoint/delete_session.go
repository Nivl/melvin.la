package httpendpoint

import (
	"fmt"
	"net/http"

	"github.com/Nivl/melvin.la/api/internal/lib/httputil"
	"github.com/Nivl/melvin.la/api/internal/uflib/ufhttputil"
	"github.com/labstack/echo/v4"
)

// DeleteSession soft-removes the current session of the user
func DeleteSession(ec echo.Context) error {
	c, _ := ec.(*ufhttputil.Context)
	if c.User() == nil {
		return httputil.NewAuthenticationError("user not authenticated")
	}
	query := `
		UPDATE user_sessions
			SET deleted_at = NOW()
		WHERE
			token=:token
	`
	_, err := c.DB().NamedExecContext(c.Request().Context(), query, map[string]interface{}{
		"token": c.SessionToken(),
	})
	if err != nil {
		return fmt.Errorf("could not soft-delete session: %w", err)
	}

	return c.NoContent(http.StatusNoContent)
}
