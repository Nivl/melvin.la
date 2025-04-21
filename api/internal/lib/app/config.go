package app

import (
	"context"
	"fmt"

	"github.com/Nivl/melvin.la/api/internal/lib/secret"
	"github.com/sethvargo/go-envconfig"
)

// Config represents the configuration for the app
type Config struct {
	Environment string `env:"ENVIRONMENT,default=dev"`
	API         struct {
		PostgresURL       secret.Secret `env:"POSTGRES_URL,required"`
		LauchDarklySDKKey secret.Secret `env:"LAUNCH_DARKLY_SDK_KEY"`
		Port              string        `env:"PORT,default=5000"`
		SSLCertsDir       string        `env:"SSL_CERTS_DIR"`
		ExtraCORSOrigins  []string      `env:"EXTRA_CORS_ORIGINS"`
	} `env:",prefix=API_"`
}

func LoadConfig(ctx context.Context) (*Config, error) {
	var cfg *Config
	if err := envconfig.Process(ctx, &cfg); err != nil {
		return nil, fmt.Errorf("couldn't parse the env: %w", err)
	}
	return cfg, nil
}

func New(ctx context.Context) (*Config, *Dependencies, error) {
	cfg, err := LoadConfig(ctx)
	if err != nil {
		return nil, nil, fmt.Errorf("couldn't load the env: %w", err)
	}
	deps, err := NewDependencies(ctx, cfg)
	if err != nil {
		return nil, nil, fmt.Errorf("couldn't create dependencies: %w", err)
	}
	return cfg, deps, nil
}
