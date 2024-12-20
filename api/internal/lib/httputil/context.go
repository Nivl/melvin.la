package httputil

import (
	"github.com/Nivl/melvin.la/api/internal/lib/fflag"
	"github.com/heetch/sqalx"
	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
)

// Context represents the context and dependencies needed by all the requests
type Context struct {
	echo.Context
	db          sqalx.Node
	logger      *zap.Logger
	featureFlag fflag.FeatureFlag
}

// SetDB sets the DB connection
func (c *Context) SetDB(db sqalx.Node) {
	c.db = db
}

// DB returns the DB connection
func (c *Context) DB() sqalx.Node { //nolint:ireturn // needed for mocking purposes
	return c.db
}

// Log returns the logger of the context
func (c *Context) Log() *zap.Logger {
	return c.logger
}

// SetLog sets the context logger
func (c *Context) SetLog(logger *zap.Logger) {
	c.logger = logger
}

// FeatureFlag returns the feature flag provider
func (c *Context) FeatureFlag() fflag.FeatureFlag {
	return c.featureFlag
}

// SetFeatureFlag sets the feature flag provider
func (c *Context) SetFeatureFlag(featureFlag fflag.FeatureFlag) {
	c.featureFlag = featureFlag
}
