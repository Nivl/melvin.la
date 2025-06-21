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
		FortniteAPIKey   secret.Secret `env:"FORTNITE_API_KEY,required"`
		Port             string        `env:"PORT,default=5000"`
		SSLCertsDir      string        `env:"SSL_CERTS_DIR"`
		ExtraCORSOrigins []string      `env:"EXTRA_CORS_ORIGINS"`
	} `env:",prefix=API_"`
}

// LoadConfig loads the configuration from the environment
func LoadConfig(ctx context.Context) (*Config, error) {
	cfg := &Config{} //nolint:exhaustruct // Will be filled by envconfig
	if err := envconfig.Process(ctx, cfg); err != nil {
		return nil, fmt.Errorf("couldn't parse the env: %w", err)
	}
	return cfg, nil
}

// New creates a returns a new Config and Dependencies object by
// parsing the environment variables
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
