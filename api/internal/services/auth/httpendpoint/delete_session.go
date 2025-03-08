package httpendpoint

import (
	"fmt"
	"net/http"

	"github.com/Nivl/melvin.la/api/.gen/api-melvinla/public/table"
	"github.com/Nivl/melvin.la/api/internal/lib/httputil"
	"github.com/Nivl/melvin.la/api/internal/uflib/ufhttputil"
	"github.com/go-jet/jet/v2/postgres"
	"github.com/labstack/echo/v4"
)

// DeleteSession soft-removes the current session of the user
func DeleteSession(ec echo.Context) error {
	c, _ := ec.(*ufhttputil.Context)
	if c.User() == nil {
		return httputil.NewAuthenticationError("user not authenticated")
	}

	_, err := table.UserSessions.
		UPDATE().
		SET(table.UserSessions.DeletedAt.SET(postgres.NOW())).
		WHERE(table.UserSessions.Token.EQ(postgres.String(c.SessionToken()))).
		ExecContext(c.Request().Context(), c.DB())
	if err != nil {
		return fmt.Errorf("could not soft-delete session: %w", err)
	}

	return c.NoContent(http.StatusNoContent)
}
