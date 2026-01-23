package middleware

import (
	"errors"
	"fmt"
	"net/http"
	"runtime"

	"github.com/Nivl/melvin.la/api/internal/lib/httputil/request"
	"github.com/labstack/echo/v5"
)

// Recover recovers a panic and logs it.
func Recover() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(ec echo.Context) (returnedErr error) {
			c, _ := ec.(*request.Context)

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
