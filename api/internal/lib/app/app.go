// Package app contains core structs and functions that are common to
// multiple apps
package app

import (
	"fmt"
	"strings"

	"github.com/Nivl/melvin.la/api/internal/lib/secret"
	"github.com/heetch/sqalx"
	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"
)

// Config represents the configuration for the app
type Config struct {
	PostgresURI secret.Secret `exhaustruct:"optional"`
	Environment string
	UseDB       bool `exhaustruct:"optional"`
	Features    FeaturesConfig
}

// FeaturesConfig represents the configuration for specific features
// of the app
// TODO(melvin): Use a feature flag library
type FeaturesConfig struct {
	SignUp bool `env:"SIGN_UP,required"`
}

// New creates and returns a Dependency object
func New(cfg *Config) (deps *Dependencies, returnedErr error) {
	logger, err := zap.NewProduction()
	if !strings.EqualFold(cfg.Environment, "production") {
		logger, err = zap.NewDevelopment()
	}
	if err != nil {
		return nil, fmt.Errorf("couldn't create a logger: %w", err)
	}
	defer func() {
		if returnedErr != nil {
			logger.Sync() //nolint:errcheck // can't do anything about it
		}
	}()

	var dbNode sqalx.Node
	if cfg.UseDB {
		var db *sqlx.DB
		db, err = sqlx.Connect("pgx", cfg.PostgresURI.Get())
		if err != nil {
			return nil, fmt.Errorf("couldn't connect to the database: %w", err)
		}
		defer func() {
			if returnedErr != nil {
				if e := db.Close(); e != nil {
					logger.Error("could not close database", zap.Error(e))
				}
			}
		}()

		dbNode, err = sqalx.New(db.Unsafe())
		if err != nil {
			return nil, fmt.Errorf("couldn't create a sqalx node: %w", err)
		}
	}

	return &Dependencies{
		Logger: logger,
		DB:     dbNode,
	}, nil
}
