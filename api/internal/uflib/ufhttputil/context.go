package ufhttputil

import (
	dbpublic "github.com/Nivl/melvin.la/api/internal/gen/sql"
	"github.com/Nivl/melvin.la/api/internal/lib/httputil"
	"github.com/google/uuid"

	"go.uber.org/zap"
)

// Context represents the context and dependencies needed by all the
// user-facing requests
type Context struct {
	*httputil.Context
	user         *dbpublic.User
	sessionToken uuid.UUID
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
