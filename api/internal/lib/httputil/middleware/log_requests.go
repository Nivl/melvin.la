package middleware

import (
	"errors"
	"net/http"

	"github.com/Nivl/melvin.la/api/internal/lib/httputil/request"
	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
)

// LogRequests is a middleware that logs the requests
func LogRequests() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(ec echo.Context) error {
			c, _ := ec.(*request.Context)

			c.Log().Info("New incoming request",
				zap.String("path", c.Request().URL.Path),
				zap.String("method", c.Request().Method),
			)

			err := next(c)
			httpCode := c.Response().Status
			switch err {
			case nil:
				c.Log().Info("Request successful", zap.Int("status", httpCode))
			default:
				if httpCode == http.StatusOK {
					httpCode = http.StatusInternalServerError
				}
				var e *echo.HTTPError
				if errors.As(err, &e) {
					httpCode = e.Code
				}
				c.Log().Info(err.Error(), zap.Int("status", httpCode))
			}
			return err
		}
	}
}
