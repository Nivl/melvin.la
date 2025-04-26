package request

import (
	dbpublic "github.com/Nivl/melvin.la/api/internal/gen/sql"
	"github.com/Nivl/melvin.la/api/internal/lib/fflag"
	"github.com/Nivl/melvin.la/api/internal/lib/sqlutil"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
)

// Context represents the context and dependencies needed by all the requests
type Context struct {
	echo.Context
	db           sqlutil.Querier
	logger       *zap.Logger
	featureFlag  fflag.FeatureFlag
	user         *dbpublic.User
	sessionToken uuid.UUID
}

// SetDB sets the DB connection
func (c *Context) SetDB(db sqlutil.Querier) {
	c.db = db
}

// DB returns the DB connection
func (c *Context) DB() sqlutil.Querier { //nolint:ireturn // needed for mocking purposes
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

// SetUser set the user that initiated the request
func (c *Context) SetUser(u *dbpublic.User) {
	c.user = u
	c.SetLog(c.Log().With(zap.String("user_id", u.ID.String())))
	c.SetFeatureFlag(c.FeatureFlag().WithKey(u.ID.String()))
}

// User returns the user that initiated the request or nil if no auth
// were provided
func (c *Context) User() *dbpublic.User {
	return c.user
}

// SetSessionToken sets the session token used to authenticate the user
func (c *Context) SetSessionToken(t uuid.UUID) {
	c.sessionToken = t
}

// SessionToken return the session token used to authenticate the user
func (c *Context) SessionToken() uuid.UUID {
	return c.sessionToken
}
