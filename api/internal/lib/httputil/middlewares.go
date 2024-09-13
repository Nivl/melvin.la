package httputil

import (
	"errors"
	"fmt"
	"net/http"
	"runtime"

	"github.com/Nivl/melvin.la/api/internal/lib/app"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
)

// LogRequests is a middleware that logs the requests
func LogRequests() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(ec echo.Context) error {
			c, _ := ec.(*Context)

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

// Recover recovers a panic and logs it.
func Recover() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(ec echo.Context) (returnedErr error) {
			c, _ := ec.(*Context)

			defer (func() {
				if r := recover(); r != nil {
					err, ok := r.(error)
					switch ok {
					case true:
						// ErrAbortHandler means we must stop everything,
						// not log anything, not print stacks trace, etc.
						if errors.Is(err, http.ErrAbortHandler) {
							panic(r)
						}
					case false:
						err = fmt.Errorf("%v", r) //nolint:err113 // no choice here than creating a dynamic error
					}

					stack := make([]byte, 4<<10) // 4kb
					length := runtime.Stack(stack, true)
					stack = stack[:length]
					msg := fmt.Sprintf("[PANIC RECOVER] %v %s\n", err, stack[:length])
					c.Log().Error(msg)
					returnedErr = err
				}
			})()

			return next(c)
		}
	}
}

// ServiceContext is a middleware that inject the dependencies into the
// context by extending the default echo context.
func ServiceContext(deps *app.Dependencies) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			cc := &Context{
				Context: c,
				db:      deps.DB,
				logger:  deps.Logger,
			}
			reqID := c.Response().Header().Get(echo.HeaderXRequestID)
			if reqID != "" {
				cc.logger = cc.logger.With(zap.String("request_id", reqID))
			}
			return next(cc)
		}
	}
}

// RequestIDConfig represents the configuration for the request ID
// middleware
type RequestIDConfig struct {
	// AllowSetFromHeader will keep any ID provided by the client
	// only set if you trust the client
	AllowSetFromHeader bool `exhaustruct:"optional"`
}

// RequestID returns a X-Request-ID middleware with the default config.
func RequestID() echo.MiddlewareFunc {
	return RequestIDWithConfig(RequestIDConfig{})
}

// RequestIDWithConfig returns a X-Request-ID middleware with config.
func RequestIDWithConfig(config RequestIDConfig) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			req := c.Request()
			res := c.Response()
			rid := req.Header.Get(echo.HeaderXRequestID)
			if rid == "" || !config.AllowSetFromHeader {
				rid = uuid.NewString()
			}
			res.Header().Set(echo.HeaderXRequestID, rid)
			return next(c)
		}
	}
}
