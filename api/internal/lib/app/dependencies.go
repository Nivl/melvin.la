// Package app contains core structs and functions that are
// common to multiple apps
package app

import (
	"context"

	"github.com/getsentry/sentry-go"
)

// Dependencies represents the app dependencies
type Dependencies struct {
	Logger sentry.Logger
}

// NewDependencies create a Dependency object from the app config by
// loading all the needed 3rd party libraries.
func NewDependencies(ctx context.Context, _ *Config) (deps *Dependencies, returnedErr error) {
	logger := sentry.NewLogger(ctx)

	return &Dependencies{
		Logger: logger,
	}, nil
}
