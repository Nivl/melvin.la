// Binary monolith contains the entire app in a single binary.
package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/Nivl/melvin.la/api/internal"
	"github.com/Nivl/melvin.la/api/internal/gen/api"
	"github.com/Nivl/melvin.la/api/internal/lib/app"
	"github.com/Nivl/melvin.la/api/internal/lib/httpserver"
	"github.com/Nivl/melvin.la/api/internal/lib/httpserver/middleware"
	"github.com/Nivl/melvin.la/api/internal/server"
	"github.com/getsentry/sentry-go"
	"github.com/labstack/echo/v4"
)

// commitSHA is the git commit sha at build time, it is set using -ldflags
// during build.
var commitSHA string

func main() {
	if err := run(); err != nil {
		log.Fatalln(err)
	}
}

func run() (returnedErr error) {
	ctx := context.Background()

	// Load the config and build the deps
	cfg, deps, err := app.New(ctx, commitSHA)
	if err != nil {
		return err
	}
	defer sentry.Flush(2 * time.Second)

	validator, err := internal.NewOpenAPISpecValidator()
	if err != nil {
		fullErr := fmt.Errorf("create an OpenAPI spec validator: %w", err)
		deps.Logger.Error().
			String("error", fullErr.Error()).
			Emit("failed to create OpenAPI spec validator")
		return fullErr
	}

	// Setup and start the server
	e := httpserver.NewBaseRouter(deps)
	e.IPExtractor = echo.ExtractIPDirect()
	origins := []string{"https://melvin.la"}
	if len(cfg.API.ExtraCORSOrigins) > 0 {
		origins = append(origins, cfg.API.ExtraCORSOrigins...)
	}
	e.Use(middleware.CORS(middleware.CORSConfig{ //nolint:exhaustruct // no need of everything
		AllowOrigins: origins,
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodDelete, http.MethodPatch, http.MethodOptions},
	}))
	e.Use(middleware.Validation(validator))

	srv := server.NewServer(cfg.API.FortniteAPIKey)
	strictHandler := api.NewStrictHandler(srv, nil)
	api.RegisterHandlers(e, strictHandler)

	err = httpserver.StartAndWaitWithCb(ctx, deps.Logger, e, httpserver.StartAndWaitOpts{
		Port:      cfg.API.Port,
		CertsPath: cfg.API.SSLCertsDir,
		Callback:  nil,
	})

	return err
}
