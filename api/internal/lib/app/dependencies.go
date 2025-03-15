package app

import (
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
