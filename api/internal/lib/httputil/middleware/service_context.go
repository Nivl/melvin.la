package middleware

import (
	"github.com/Nivl/melvin.la/api/internal/lib/app"
	"github.com/Nivl/melvin.la/api/internal/lib/httputil/request"
	"github.com/getsentry/sentry-go"
	"github.com/getsentry/sentry-go/attribute"
	"github.com/labstack/echo/v4"
)

// ServiceContext is a middleware that inject the dependencies into the
// context by extending the default echo context.
func ServiceContext(_ *app.Dependencies) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			cc := &request.Context{
				Context: c,
			}

			logger := sentry.NewLogger(c.Request().Context())
			cc.SetLog(logger)

			reqID := c.Response().Header().Get(echo.HeaderXRequestID)
			if reqID != "" {
				logger.SetAttributes(attribute.String("request_id", reqID))
			}
			return next(cc)
		}
	}
}
