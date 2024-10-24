package ufhttputil

import (
	"database/sql"
	"errors"
	"strings"

	"github.com/Nivl/melvin.la/api/internal/lib/httputil"
	"github.com/Nivl/melvin.la/api/internal/services/auth/models"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

// ServiceContext is a middleware that inject the user facing dependencies into the
// context by extending the default echo context.
func ServiceContext() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(ec echo.Context) error {
			httpContext, _ := ec.(*httputil.Context)
			return next(&Context{ //nolint:exhaustruct // The values are filled by other middlerwares
				Context: httpContext,
			})
		}
	}
}

// AuthUser is a middleware that authenticate the user if a token has
// been provided to the request
func AuthUser() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(ec echo.Context) error {
			c, _ := ec.(*Context)
			ctx := c.Request().Context()
			authHeader := c.Request().Header.Get("Authorization")
			if authHeader != "" {
				// the token has the following format:
				// Bearer sessionToken
				if !strings.HasPrefix(authHeader, "Bearer ") {
					return httputil.NewBadRequestError("Invalid authorization format")
				}
				sessionToken := strings.TrimPrefix(authHeader, "Bearer ")
				if _, err := uuid.Parse(sessionToken); err != nil {
					return httputil.NewBadRequestError("Invalid authorization format")
				}
				var u models.User
				query := `
			SELECT u.*
			FROM users u
			LEFT JOIN user_sessions us
				ON u.id = us.user_id
			WHERE us.token=$1
				AND us.deleted_at IS NULL
				AND u.deleted_at IS NULL`
				err := c.DB().GetContext(ctx, &u, query, sessionToken)
				if err != nil {
					if errors.Is(err, sql.ErrNoRows) {
						return httputil.NewAuthenticationError("token invalid or expired")
					}
					// TODO(melvin): return custom error to user and log real error
					// We probably always want to return a "invalid token" error
					return err
				}
				c.SetUser(&u)
				c.SetSessionToken(sessionToken)
			}
			return next(c)
		}
	}
}
