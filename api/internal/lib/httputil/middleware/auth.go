package middleware

import (
	"database/sql"
	"errors"
	"fmt"
	"strings"

	"github.com/Nivl/melvin.la/api/internal/lib/httputil/httperror"
	"github.com/Nivl/melvin.la/api/internal/lib/httputil/request"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

// Auth is a middleware that authenticate the user if a token has
// been provided to the request
// TODO(melvin): Use a JWT token instead of a session token
func Auth() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(ec echo.Context) error {
			c, _ := ec.(*request.Context)
			ctx := c.Request().Context()
			rawSessionToken := strings.TrimSpace(c.Request().Header.Get("X-Api-Key"))
			if rawSessionToken != "" {
				if err := uuid.Validate(rawSessionToken); err != nil {
					return httperror.NewBadRequestError("Invalid token format")
				}
				sessionToken, err := uuid.Parse(rawSessionToken)
				if err != nil {
					return fmt.Errorf("could not parse valid session token %s: %w", rawSessionToken, err)
				}

				user, err := c.DB().GetUserBySessionToken(ctx, sessionToken)
				if err != nil {
					if errors.Is(err, sql.ErrNoRows) {
						return httperror.NewAuthenticationError("token invalid or expired")
					}
					// TODO(melvin): return custom error to user and log real error
					// We probably always want to return a "invalid token" error
					return err
				}
				c.SetUser(user)
				c.SetSessionToken(sessionToken)
			}
			return next(c)
		}
	}
}
