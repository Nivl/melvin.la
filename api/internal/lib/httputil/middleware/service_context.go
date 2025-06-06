package middleware

import (
	"github.com/Nivl/melvin.la/api/internal/lib/app"
	"github.com/Nivl/melvin.la/api/internal/lib/httputil/request"
	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
)

// ServiceContext is a middleware that inject the dependencies into the
// context by extending the default echo context.
func ServiceContext(deps *app.Dependencies) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			cc := &request.Context{
				Context: c,
			}

			cc.SetLog(deps.Logger)
			cc.SetFeatureFlag(deps.FeatureFlag)

			reqID := c.Response().Header().Get(echo.HeaderXRequestID)
			if reqID != "" {
				cc.SetLog(cc.Log().With(zap.String("request_id", reqID)))
			}
			return next(cc)
		}
	}
}
