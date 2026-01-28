package httputil

import (
	"github.com/Nivl/melvin.la/api/internal/lib/app"
	"github.com/Nivl/melvin.la/api/internal/lib/httputil/middleware"
	sentryecho "github.com/getsentry/sentry-go/echo"
	"github.com/labstack/echo/v4"
)

// NewBaseRouter returns a new router with the default middlewares
func NewBaseRouter(deps *app.Dependencies) *echo.Echo {
	e := echo.New()
	e.HTTPErrorHandler = HTTPErrorHandler(e)

	// The order matters
	e.Use(middleware.Recover())
	e.Use(sentryecho.New(sentryecho.Options{ //nolint:exhaustruct // we want to keep sentry's defaults
		Repanic: true,
	}))
	e.Use(middleware.RequestID())
	e.Use(middleware.ServiceContext(deps))
	// Must be before LogRequests to avoid messing with the memory
	e.Use(middleware.BodyLimit("5K"))
	e.Use(middleware.LogRequests(e))
	return e
}
