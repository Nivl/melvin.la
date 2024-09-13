package app

import (
	"github.com/heetch/sqalx"
	"go.uber.org/zap"
)

// Dependencies represents the app dependencies
type Dependencies struct {
	DB     sqalx.Node `exhaustruct:"optional"`
	Logger *zap.Logger
}
