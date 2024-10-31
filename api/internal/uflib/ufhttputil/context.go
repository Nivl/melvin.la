package ufhttputil

import (
	"github.com/Nivl/melvin.la/api/internal/lib/httputil"
	"github.com/Nivl/melvin.la/api/internal/services/auth/models"

	"go.uber.org/zap"
)

// Context represents the context and dependencies needed by all the
// user-facing requests
type Context struct {
	*httputil.Context
	user         *models.User
	sessionToken string
}

// SetUser set the user that initiated the request
func (c *Context) SetUser(u *models.User) {
	c.user = u
	c.SetLog(c.Log().With(zap.String("user_id", u.ID)))
	c.SetFeatureFlag(c.FeatureFlag().WithKey(u.ID))
}

// User returns the user that initiated the request or nil if no auth
// were provided
func (c *Context) User() *models.User {
	return c.user
}

// SetSessionToken sets the session token used to authenticate the user
func (c *Context) SetSessionToken(t string) {
	c.sessionToken = t
}

// SessionToken return the session token used to authenticate the user
func (c *Context) SessionToken() string {
	return c.sessionToken
}
