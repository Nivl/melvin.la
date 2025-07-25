// Package api provides primitives to interact with the openapi HTTP API.
//
// Code generated by github.com/oapi-codegen/oapi-codegen/v2 version v2.4.2-0.20250618140738-aae687ce8fe9 DO NOT EDIT.
//
// From https://github.com/oapi-codegen/oapi-codegen/blob/main/pkg/codegen/templates/imports.tmpl
// Changes:
// Add EchoContextKey
package api

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/Nivl/melvin.la/api/internal/lib/httputil/httperror"
	"github.com/labstack/echo/v4"
	"github.com/oapi-codegen/runtime"
	strictecho "github.com/oapi-codegen/runtime/strictmiddleware/echo"
)

// ServerInterface represents all server handlers.
type ServerInterface interface {
	// Get Fortnite stats.
	// (GET /fortnite/stats/{username}/{platform}/{timeWindow})
	FortniteGetStats(ctx echo.Context, username string, platform FortniteGetStatsParamsPlatform, timeWindow FortniteGetStatsParamsTimeWindow) error
}

//
// From https://github.com/oapi-codegen/oapi-codegen/blob/main/pkg/codegen/templates/echo/echo-wrappers.tmpl
// Changes:
// Replace echo.NewHTTPError with httperror.NewXXX
//

// ServerInterfaceWrapper converts echo contexts to parameters.
type ServerInterfaceWrapper struct {
	Handler ServerInterface
}

// FortniteGetStats converts echo context to params.
func (w *ServerInterfaceWrapper) FortniteGetStats(ctx echo.Context) error {
	var err error
	// ------------- Path parameter "username" -------------
	var username string

	err = runtime.BindStyledParameterWithOptions("simple", "username", ctx.Param("username"), &username, runtime.BindStyledParameterOptions{ParamLocation: runtime.ParamLocationPath, Explode: false, Required: true})
	if err != nil {
		return httperror.NewValidationErrorWithLoc("username", "missing or invalid value", "path")
	}

	// ------------- Path parameter "platform" -------------
	var platform FortniteGetStatsParamsPlatform

	err = runtime.BindStyledParameterWithOptions("simple", "platform", ctx.Param("platform"), &platform, runtime.BindStyledParameterOptions{ParamLocation: runtime.ParamLocationPath, Explode: false, Required: true})
	if err != nil {
		return httperror.NewValidationErrorWithLoc("platform", "missing or invalid value", "path")
	}

	// ------------- Path parameter "timeWindow" -------------
	var timeWindow FortniteGetStatsParamsTimeWindow

	err = runtime.BindStyledParameterWithOptions("simple", "timeWindow", ctx.Param("timeWindow"), &timeWindow, runtime.BindStyledParameterOptions{ParamLocation: runtime.ParamLocationPath, Explode: false, Required: true})
	if err != nil {
		return httperror.NewValidationErrorWithLoc("timeWindow", "missing or invalid value", "path")
	}

	ctx.Set(ApiKeyAuthScopes, []string{})

	// Invoke the callback with all the unmarshaled arguments
	err = w.Handler.FortniteGetStats(ctx, username, platform, timeWindow)
	return err
}

// This is a simple interface which specifies echo.Route addition functions which
// are present on both echo.Echo and echo.Group, since we want to allow using
// either of them for path registration
type EchoRouter interface {
	CONNECT(path string, h echo.HandlerFunc, m ...echo.MiddlewareFunc) *echo.Route
	DELETE(path string, h echo.HandlerFunc, m ...echo.MiddlewareFunc) *echo.Route
	GET(path string, h echo.HandlerFunc, m ...echo.MiddlewareFunc) *echo.Route
	HEAD(path string, h echo.HandlerFunc, m ...echo.MiddlewareFunc) *echo.Route
	OPTIONS(path string, h echo.HandlerFunc, m ...echo.MiddlewareFunc) *echo.Route
	PATCH(path string, h echo.HandlerFunc, m ...echo.MiddlewareFunc) *echo.Route
	POST(path string, h echo.HandlerFunc, m ...echo.MiddlewareFunc) *echo.Route
	PUT(path string, h echo.HandlerFunc, m ...echo.MiddlewareFunc) *echo.Route
	TRACE(path string, h echo.HandlerFunc, m ...echo.MiddlewareFunc) *echo.Route
}

// RegisterHandlers adds each server route to the EchoRouter.
func RegisterHandlers(router EchoRouter, si ServerInterface) {
	RegisterHandlersWithBaseURL(router, si, "")
}

// Registers handlers, and prepends BaseURL to the paths, so that the paths
// can be served under a prefix.
func RegisterHandlersWithBaseURL(router EchoRouter, si ServerInterface, baseURL string) {

	wrapper := ServerInterfaceWrapper{
		Handler: si,
	}

	router.GET(baseURL+"/fortnite/stats/:username/:platform/:timeWindow", wrapper.FortniteGetStats)

}

type FortniteGetStatsRequestObject struct {
	Username   string                           `json:"username"`
	Platform   FortniteGetStatsParamsPlatform   `json:"platform"`
	TimeWindow FortniteGetStatsParamsTimeWindow `json:"timeWindow"`
}

type FortniteGetStatsResponseObject interface {
	VisitFortniteGetStatsResponse(w http.ResponseWriter) error
}

type FortniteGetStats200JSONResponse FortniteStats

func (response FortniteGetStats200JSONResponse) VisitFortniteGetStatsResponse(w http.ResponseWriter) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)

	return json.NewEncoder(w).Encode(response)
}

type FortniteGetStats400JSONResponse ErrorResponse

func (response FortniteGetStats400JSONResponse) VisitFortniteGetStatsResponse(w http.ResponseWriter) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(400)

	return json.NewEncoder(w).Encode(response)
}

type FortniteGetStats403JSONResponse ErrorResponse

func (response FortniteGetStats403JSONResponse) VisitFortniteGetStatsResponse(w http.ResponseWriter) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(403)

	return json.NewEncoder(w).Encode(response)
}

type FortniteGetStats404JSONResponse ErrorResponse

func (response FortniteGetStats404JSONResponse) VisitFortniteGetStatsResponse(w http.ResponseWriter) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(404)

	return json.NewEncoder(w).Encode(response)
}

type FortniteGetStats500JSONResponse ErrorResponse

func (response FortniteGetStats500JSONResponse) VisitFortniteGetStatsResponse(w http.ResponseWriter) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(500)

	return json.NewEncoder(w).Encode(response)
}

// StrictServerInterface represents all server handlers.
type StrictServerInterface interface {
	// Get Fortnite stats.
	// (GET /fortnite/stats/{username}/{platform}/{timeWindow})
	FortniteGetStats(ctx context.Context, request FortniteGetStatsRequestObject) (FortniteGetStatsResponseObject, error)
}

//
// From https://github.com/oapi-codegen/oapi-codegen/blob/main/pkg/codegen/templates/strict/strict-echo.tmpl
// Changes:
// - Add EchoContextKey
// - Add Echo to the request's context that is passed to the handlers
// - Return httperror when body cannot be parsed correctly
//

type contextKey string

var EchoContextKey contextKey = "echo.Context"

type StrictHandlerFunc = strictecho.StrictEchoHandlerFunc
type StrictMiddlewareFunc = strictecho.StrictEchoMiddlewareFunc

func NewStrictHandler(ssi StrictServerInterface, middlewares []StrictMiddlewareFunc) ServerInterface {
	return &strictHandler{ssi: ssi, middlewares: middlewares}
}

type strictHandler struct {
	ssi         StrictServerInterface
	middlewares []StrictMiddlewareFunc
}

// FortniteGetStats operation middleware
func (sh *strictHandler) FortniteGetStats(ctx echo.Context, username string, platform FortniteGetStatsParamsPlatform, timeWindow FortniteGetStatsParamsTimeWindow) error {
	var request FortniteGetStatsRequestObject

	request.Username = username
	request.Platform = platform
	request.TimeWindow = timeWindow

	handler := func(ctx echo.Context, request interface{}) (interface{}, error) {
		return sh.ssi.FortniteGetStats(
			context.WithValue(ctx.Request().Context(), EchoContextKey, ctx),
			request.(FortniteGetStatsRequestObject),
		)
	}
	for _, middleware := range sh.middlewares {
		handler = middleware(handler, "FortniteGetStats")
	}

	response, err := handler(ctx, request)

	if err != nil {
		return err
	} else if validResponse, ok := response.(FortniteGetStatsResponseObject); ok {
		return validResponse.VisitFortniteGetStatsResponse(ctx.Response())
	} else if response != nil {
		return fmt.Errorf("unexpected response type: %T", response)
	}
	return nil
}
