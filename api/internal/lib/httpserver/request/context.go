package request

import (
	"github.com/getsentry/sentry-go"
	"github.com/labstack/echo/v5"
)

// Context represents the context and dependencies needed by all the requests
type Context struct {
	echo.Context

	logger sentry.Logger
}

// Log returns the logger of the context
func (c *Context) Log() sentry.Logger {
	return c.logger
}

// SetLog sets the context logger
func (c *Context) SetLog(logger sentry.Logger) {
	c.logger = logger
}
