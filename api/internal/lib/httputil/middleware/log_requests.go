package middleware

import (
	"bufio"
	"bytes"
	"errors"
	"io"
	"net"
	"net/http"
	"strings"
	"github.com/Nivl/melvin.la/api/internal/lib/httputil/request"
	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
)

type bodyResponseWriter struct {
	io.Writer
	http.ResponseWriter
}

func (w *bodyResponseWriter) WriteHeader(code int) {
	w.ResponseWriter.WriteHeader(code)
}

func (w *bodyResponseWriter) Write(b []byte) (int, error) {
	return w.Writer.Write(b)
}

func (w *bodyResponseWriter) Flush() {
	err := http.NewResponseController(w.ResponseWriter).Flush()
	if err != nil && errors.Is(err, http.ErrNotSupported) {
		panic(errors.New("response writer flushing is not supported"))
	}
}

func (w *bodyResponseWriter) Hijack() (net.Conn, *bufio.ReadWriter, error) {
	return http.NewResponseController(w.ResponseWriter).Hijack()
}

func (w *bodyResponseWriter) Unwrap() http.ResponseWriter {
	return w.ResponseWriter
}

// LogRequests is a middleware that logs the requests
func LogRequests(e *echo.Echo) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(ec echo.Context) error {
			c, _ := ec.(*request.Context)

			// Sanitize the path to remove newline characters
			sanitizedPath := strings.ReplaceAll(c.Request().URL.Path, "\n", "")
			sanitizedPath = strings.ReplaceAll(sanitizedPath, "\r", "")
			c.Log().Info("New incoming request",
				zap.String("path", sanitizedPath),
				zap.String("method", c.Request().Method),
			)

			// Update the response body writer so we can read it
			// back later without messing with the response itself.
			//
			// /!\ This means all the responses in the app will be
			// duplicated in memory since we write to 2 writers.
			resBody := new(bytes.Buffer)
			mw := io.MultiWriter(c.Response().Writer, resBody)
			writer := &bodyResponseWriter{Writer: mw, ResponseWriter: c.Response().Writer}
			c.Response().Writer = writer

			err := next(c)
			httpCode := c.Response().Status
			switch err {
			case nil:
				response := "hidden for security reason"
				if e.Debug || httpCode >= 400 {
					response = resBody.String()
				}
				c.Log().Info("Request successful", zap.Int("status", httpCode), zap.String("response", response))
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
