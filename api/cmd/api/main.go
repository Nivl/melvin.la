// Binary monolith contains the entire app in a single binary.
package main

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/Nivl/melvin.la/api/internal/lib/app"
	"github.com/Nivl/melvin.la/api/internal/lib/errutil"
	"github.com/Nivl/melvin.la/api/internal/lib/httputil"
	"github.com/Nivl/melvin.la/api/internal/lib/secret"
	authendpoint "github.com/Nivl/melvin.la/api/internal/services/auth/httpendpoint"
	userhttpendpoint "github.com/Nivl/melvin.la/api/internal/services/user/httpendpoint"
	"github.com/Nivl/melvin.la/api/internal/uflib/ufhttputil"
	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/labstack/echo/v4"
	echomid "github.com/labstack/echo/v4/middleware"
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
	var cfg appConfig
	if err := envconfig.Process(ctx, &cfg); err != nil {
		return fmt.Errorf("couldn't parse the env: %w", err)
	}

	appCfg := &app.Config{
		Environment:     cfg.Environment,
		PostgresURI:     cfg.API.PostgresURL,
		LaunchDarklyKey: cfg.API.LauchDarklySDKKey,
	}
	deps, err := app.New(appCfg)
	if err != nil {
		return err
	}
	defer deps.Logger.Sync() //nolint:errcheck // Sync always returns an error on linux
	defer errutil.CheckWithMessage(deps.DB.Close, &returnedErr, "couldn't close the database")

	// HTTP Server
	e := httputil.NewbaseRouter(deps)
	e.IPExtractor = echo.ExtractIPDirect()
	e.Use(ufhttputil.ServiceContext())
	origins := []string{"https://melvin.la"}
	if len(cfg.API.ExtraCORSOrigins) > 0 {
		origins = append(origins, cfg.API.ExtraCORSOrigins...)
	}
	e.Use(echomid.CORSWithConfig(echomid.CORSConfig{ //nolint:exhaustruct // no need of everything
		AllowOrigins: origins,
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodDelete, http.MethodOptions},
	}))
	e.Use(ufhttputil.AuthUser())

	// User Facing endpoints
	userhttpendpoint.Register(e.Group("/users"))
	authendpoint.Register(e.Group("/auth"))

	err = httputil.StartAndWaitWithCb(ctx, deps, e, httputil.StartAndWaitOpts{
		Port:      cfg.API.Port,
		CertsPath: cfg.API.SSLCertsDir,
		Callback:  nil,
	})

	return err
}
