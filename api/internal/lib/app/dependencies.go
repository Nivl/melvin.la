// Package app contains core structs and functions that are
// common to multiple apps
package app

import (
	"context"
	"fmt"
	"strings"

	"github.com/Nivl/melvin.la/api/internal/lib/errutil"
	"go.uber.org/zap"
)

// Dependencies represents the app dependencies
type Dependencies struct {
	Logger *zap.Logger
}

// NewDependencies create a Dependency object from the app config by
// loading all the needed 3rd party libraries.
func NewDependencies(_ context.Context, cfg *Config) (deps *Dependencies, returnedErr error) {
	logger, err := zap.NewProduction()
	if !strings.EqualFold(cfg.Environment, "production") {
		logger, err = zap.NewDevelopment()
	}
	if err != nil {
		return nil, fmt.Errorf("couldn't create a logger: %w", err)
	}
	defer errutil.RunOnErr(logger.Sync, returnedErr, "could not sync the logger")

	return &Dependencies{
		Logger: logger,
	}, nil
}
