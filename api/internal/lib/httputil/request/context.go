package request

import (
	"github.com/Nivl/melvin.la/api/internal/lib/fflag"
	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
)

// Context represents the context and dependencies needed by all the requests
type Context struct {
	echo.Context
	logger      *zap.Logger
	featureFlag fflag.FeatureFlag
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
