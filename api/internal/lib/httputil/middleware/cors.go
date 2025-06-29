package middleware

import (
	echomid "github.com/labstack/echo/v4/middleware"

	"github.com/labstack/echo/v4"
)

// CORSConfig defines the config for CORS middleware.
type CORSConfig = echomid.CORSConfig

// CORS is a middleware that sets the CORS headers for the response
func CORS(cfg CORSConfig) echo.MiddlewareFunc {
	return echomid.CORSWithConfig(cfg)
}
