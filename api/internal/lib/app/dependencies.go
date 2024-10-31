package app

import (
	"github.com/Nivl/melvin.la/api/internal/lib/fflag"
	"github.com/heetch/sqalx"
	"go.uber.org/zap"
)

// Dependencies represents the app dependencies
type Dependencies struct {
	DB          sqalx.Node `exhaustruct:"optional"`
	Logger      *zap.Logger
	FeatureFlag fflag.FeatureFlag
}
