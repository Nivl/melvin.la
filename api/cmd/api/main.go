// Binary monolith contains the entire app in a single binary.
package main

import (
	"context"
	"log"
	"net/http"

	"github.com/Nivl/melvin.la/api/internal/gen/api"
	"github.com/Nivl/melvin.la/api/internal/lib/app"
	"github.com/Nivl/melvin.la/api/internal/lib/httputil"
	"github.com/Nivl/melvin.la/api/internal/lib/httputil/middleware"
	"github.com/Nivl/melvin.la/api/internal/server"
	"github.com/labstack/echo/v4"
)

func main() {
	if err := run(); err != nil {
		log.Fatalln(err)
	}
}

func run() (returnedErr error) {
	ctx := context.Background()

	// Load the config and build the deps
	cfg, deps, err := app.New(ctx)
	if err != nil {
		return err
	}
	defer deps.Logger.Sync() //nolint:errcheck // Sync always returns an error on linux

	// Setup and start the server
	e := httputil.NewBaseRouter(deps)
	e.IPExtractor = echo.ExtractIPDirect()
	origins := []string{"https://melvin.la"}
	if len(cfg.API.ExtraCORSOrigins) > 0 {
		origins = append(origins, cfg.API.ExtraCORSOrigins...)
	}
	e.Use(middleware.CORS(middleware.CORSConfig{ //nolint:exhaustruct // no need of everything
		AllowOrigins: origins,
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodDelete, http.MethodPatch, http.MethodOptions},
	}))

	srv := server.NewServer(cfg.API.FortniteAPIKey)
	strictHandler := api.NewStrictHandler(srv, nil)
	api.RegisterHandlers(e, strictHandler)

	err = httputil.StartAndWaitWithCb(ctx, deps.Logger, e, httputil.StartAndWaitOpts{
		Port:      cfg.API.Port,
		CertsPath: cfg.API.SSLCertsDir,
		Callback:  nil,
	})

	return err
}
