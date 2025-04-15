package httputil

import (
	"github.com/Nivl/melvin.la/api/internal/lib/dependencies"
	"github.com/Nivl/melvin.la/api/internal/lib/httputil/middleware"
	"github.com/labstack/echo/v4"
)

// NewBaseRouter returns a new router with the default middlewares
func NewBaseRouter(deps *dependencies.Dependencies) *echo.Echo {
	e := echo.New()
	e.Use(middleware.ServiceContext(deps))
	e.Use(middleware.LogRequests())
	e.Use(middleware.BodyLimit("5K"))
	e.Use(middleware.Recover())
	return e
}
