package payload

import (
	"github.com/Nivl/melvin.la/api/internal/gen/api"
	dbpublic "github.com/Nivl/melvin.la/api/internal/gen/sql"
)

func NewSession(u *dbpublic.UserSession) api.Session {
	return api.Session{
		Token:        u.Token,
		RefreshToken: u.RefreshToken,
		ExpiresAt:    u.ExpiresAt.Time,
		UserId:       u.UserID,
	}
}
