package httputil

import (
	"github.com/Nivl/melvin.la/api/internal/lib/app"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

// NewbaseRouter returns a new router with the default middlewares
func NewbaseRouter(deps *app.Dependencies) *echo.Echo {
	e := echo.New()
	e.Use(RequestID())
	e.Use(ServiceContext(deps))
	e.Use(LogRequests())
	e.Use(middleware.BodyLimit("5K"))
	e.Use(Recover())
	return e
}
