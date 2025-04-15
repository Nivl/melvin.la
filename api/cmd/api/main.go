// Binary monolith contains the entire app in a single binary.
package main

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/Nivl/melvin.la/api/internal/gen/api"
	"github.com/Nivl/melvin.la/api/internal/lib/dependencies"
	"github.com/Nivl/melvin.la/api/internal/lib/errutil"
	"github.com/Nivl/melvin.la/api/internal/lib/httputil"
	"github.com/Nivl/melvin.la/api/internal/lib/httputil/middleware"
	"github.com/Nivl/melvin.la/api/internal/lib/secret"
	"github.com/Nivl/melvin.la/api/internal/server"
	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/labstack/echo/v4"
	"github.com/sethvargo/go-envconfig"
)

type appConfig struct {
	Environment string `env:"ENVIRONMENT,default=dev"`
	API         struct {
		PostgresURL       secret.Secret `env:"POSTGRES_URL,required"`
		LauchDarklySDKKey secret.Secret `env:"LAUNCH_DARKLY_SDK_KEY"`
		Port              string        `env:"PORT,default=5000"`
		SSLCertsDir       string        `env:"SSL_CERTS_DIR"`
		ExtraCORSOrigins  []string      `env:"EXTRA_CORS_ORIGINS"`
	} `env:",prefix=API_"`
}

func main() {
	if err := run(); err != nil {
		log.Fatalln(err)
	}
}

func run() (returnedErr error) {
	ctx := context.Background()
	// Load the config and build the deps
	var cfg appConfig
	if err := envconfig.Process(ctx, &cfg); err != nil {
		return fmt.Errorf("couldn't parse the env: %w", err)
	}
	appCfg := &dependencies.Config{
		Environment:     cfg.Environment,
		PostgresURI:     cfg.API.PostgresURL,
		LaunchDarklyKey: cfg.API.LauchDarklySDKKey,
	}
	deps, err := dependencies.New(ctx, appCfg)
	if err != nil {
		return err
	}
	defer deps.Logger.Sync() //nolint:errcheck // Sync always returns an error on linux
	defer errutil.RunAndSetErrorCtx(ctx, deps.DB.Close, &returnedErr, "couldn't close the database")

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
	e.Use(middleware.Auth())

	srv := server.NewServer()
	api.RegisterHandlers(e, srv)

	err = httputil.StartAndWaitWithCb(ctx, deps.Logger, e, httputil.StartAndWaitOpts{
		Port:      cfg.API.Port,
		CertsPath: cfg.API.SSLCertsDir,
		Callback:  nil,
	})

	return err
}
