package httpserver

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/labstack/echo/v4"
)

// HTTPErrorHandler is a custom HTTP error handler for Echo.
//
// The main change is to add the "code" field to the response body.
// If the code is no longer required, then we can stop using this
// handler and switch back to the default one.
//
// This is mostly a workaround for the client-side code generation
// because the lib we use doesn't provide the HTTP status code
// of the response. Meaning in case of an error with no body,
// we don't know what happened (e.g. 401, 403, 404, 500, 503, ...).
//
// See:
// https://github.com/openapi-ts/openapi-typescript/issues/2257
// https://github.com/openapi-ts/openapi-typescript/issues/2238
func HTTPErrorHandler(e *echo.Echo) echo.HTTPErrorHandler {
	return func(err error, c echo.Context) {
		if c.Response().Committed {
			return
		}

		var he *echo.HTTPError
		if errors.As(err, &he) {
			if he.Internal != nil {
				var herr *echo.HTTPError
				if errors.As(he.Internal, &herr) {
					he = herr
				}
			}
		} else {
			he = &echo.HTTPError{
				Code:     http.StatusInternalServerError,
				Message:  http.StatusText(http.StatusInternalServerError),
				Internal: nil,
			}
		}

		// Issue #1426
		code := he.Code
		message := he.Message

		switch m := he.Message.(type) {
		case string:
			if e.Debug {
				message = echo.Map{"code": he.Code, "message": m, "error": err.Error()}
			} else {
				message = echo.Map{"code": he.Code, "message": m}
			}
		case json.Marshaler:
			// do nothing - this type knows how to format itself to JSON
		case error:
			message = echo.Map{"code": he.Code, "message": m.Error()}
		}

		// Send response
		if c.Request().Method == http.MethodHead { // Issue #608
			err = c.NoContent(he.Code)
		} else {
			err = c.JSON(code, message)
		}
		if err != nil {
			e.Logger.Error(err)
		}
	}
}
