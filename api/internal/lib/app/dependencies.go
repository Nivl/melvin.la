// Package app contains core structs and functions that are
// common to multiple apps
package app

import (
	"context"
	"fmt"
	"strings"

	"github.com/Nivl/melvin.la/api/internal/lib/errutil"
	"github.com/Nivl/melvin.la/api/internal/lib/fflag"
	"github.com/jackc/pgx/v5"
	"go.uber.org/zap"
)

// Dependencies represents the app dependencies
type Dependencies struct {
	DB          *pgx.Conn `exhaustruct:"optional"`
	Logger      *zap.Logger
	FeatureFlag fflag.FeatureFlag
}

// NewDependencies create a Dependency object from the app config by
// loading all the needed 3rd party libraries.
func NewDependencies(ctx context.Context, cfg *Config) (deps *Dependencies, returnedErr error) {
	logger, err := zap.NewProduction()
	if !strings.EqualFold(cfg.Environment, "production") {
		logger, err = zap.NewDevelopment()
	}
	if err != nil {
		return nil, fmt.Errorf("couldn't create a logger: %w", err)
	}
	defer errutil.RunOnErr(logger.Sync, returnedErr, "could not sync the logger")

	db, err := pgx.Connect(ctx, cfg.API.PostgresURL.Get())
	if err != nil {
		return nil, fmt.Errorf("couldn't connect to the database: %w", err)
	}
	defer errutil.RunOnErrWithCtx(ctx, db.Close, returnedErr, "could not close database")

	featureFlag, err := fflag.NewLD(cfg.API.LauchDarklySDKKey.Get(), logger)
	if err != nil {
		return nil, fmt.Errorf("couldn't create the Launch Darkly client: %w", err)
	}

	return &Dependencies{
		Logger:      logger,
		DB:          db,
		FeatureFlag: featureFlag,
	}, nil
}
