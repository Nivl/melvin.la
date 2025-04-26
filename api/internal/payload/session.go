package payload

import (
	"github.com/Nivl/melvin.la/api/internal/gen/api"
	dbpublic "github.com/Nivl/melvin.la/api/internal/gen/sql"
)

// NewSession creates a Session response object from SQL object
func NewSession(u *dbpublic.UserSession) api.Session {
	return api.Session{
		Token:        u.Token,
		RefreshToken: u.RefreshToken,
		ExpiresAt:    u.ExpiresAt.Time,
		UserID:       u.UserID,
	}
}
