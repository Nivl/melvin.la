package middleware

import (
	echomid "github.com/labstack/echo/v4/middleware"

	"github.com/labstack/echo/v4"
)

// RequestID is a middleware that sets the request ID of the request
func RequestID() echo.MiddlewareFunc {
	return echomid.RequestID()
}
