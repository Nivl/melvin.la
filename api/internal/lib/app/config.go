package app

import (
	"context"
	"fmt"
	"strings"

	"github.com/Nivl/melvin.la/api/internal/lib/secret"
	"github.com/getsentry/sentry-go"
	"github.com/sethvargo/go-envconfig"
)

// Config represents the configuration for the app
type Config struct {
	Environment string `env:"ENVIRONMENT,default=dev"`
	API         struct {
		FortniteAPIKey   secret.Secret `env:"FORTNITE_API_KEY,required"`
		SentryDSN        secret.Secret `env:"SENTRY_DSN,required"`
		Port             string        `env:"PORT,default=5000"`
		SSLCertsDir      string        `env:"SSL_CERTS_DIR"`
		ExtraCORSOrigins []string      `env:"EXTRA_CORS_ORIGINS"`
	} `env:",prefix=API_"`
}

// LoadConfig loads the configuration from the environment
func LoadConfig(ctx context.Context) (*Config, error) {
	cfg := &Config{} //nolint:exhaustruct // Will be filled by envconfig
	if err := envconfig.Process(ctx, cfg); err != nil {
		return nil, fmt.Errorf("parse the env: %w", err)
	}
	return cfg, nil
}

// New creates a returns a new Config and Dependencies object by
// parsing the environment variables
func New(ctx context.Context, releaseVersion string) (*Config, *Dependencies, error) {
	cfg, err := LoadConfig(ctx)
	if err != nil {
		return nil, nil, fmt.Errorf("load the app config: %w", err)
	}

	err = sentry.Init(sentry.ClientOptions{ //nolint:exhaustruct // We want to keep sentry's defaults for most options
		Dsn:           cfg.API.SentryDSN.Get(),
		EnableTracing: true,
		EnableLogs:    true,
		Release:       releaseVersion,
		Debug:         !strings.EqualFold(cfg.Environment, "production"),
	})
	if err != nil {
		return nil, nil, fmt.Errorf("initialize sentry: %w", err)
	}

	deps, err := NewDependencies(ctx, cfg)
	if err != nil {
		return nil, nil, fmt.Errorf("create dependencies: %w", err)
	}
	return cfg, deps, nil
}
