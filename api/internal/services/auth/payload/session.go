package payload

import (
	"time"

	dbpublic "github.com/Nivl/melvin.la/api/internal/gen/sql"
)

// Session represents a valid session for the user to use to login
type Session struct {
	ExpiresAt    time.Time `json:"expiresAt"`
	Token        string    `json:"token"`
	UserID       string    `json:"userId"`
	RefreshToken string    `json:"refreshToken"`
}

// NewSession creates a new Session payload
func NewSession(s *dbpublic.UserSession) *Session {
	return &Session{
		Token:        s.Token.String(),
		UserID:       s.UserID.String(),
		RefreshToken: s.RefreshToken.String(),
		ExpiresAt:    s.ExpiresAt.Time,
	}
}
