package httputil

import (
	"github.com/Nivl/melvin.la/api/internal/lib/app"
	"github.com/Nivl/melvin.la/api/internal/lib/httputil/middleware"
	"github.com/labstack/echo/v5"
)

// NewBaseRouter returns a new router with the default middlewares
func NewBaseRouter(deps *app.Dependencies) *echo.Echo {
	e := echo.New()
	e.HTTPErrorHandler = HTTPErrorHandler(e)

	// The order matters
	e.Use(middleware.RequestID())
	e.Use(middleware.ServiceContext(deps))
	e.Use(middleware.LogRequests(e))
	e.Use(middleware.BodyLimit("5K"))
	e.Use(middleware.Recover())
	return e
}
