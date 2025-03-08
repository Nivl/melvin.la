package payload

import (
	"time"

	"github.com/Nivl/melvin.la/api/.gen/api-melvinla/public/model"
)

// Session represents a valid session for the user to use to login
type Session struct {
	ExpiresAt    time.Time `json:"expiresAt"`
	Token        string    `json:"token"`
	UserID       string    `json:"userId"`
	RefreshToken string    `json:"refreshToken"`
}

// NewSession creates a new Session payload
func NewSession(s *model.UserSessions) *Session {
	return &Session{
		Token:        s.Token.String(),
		UserID:       s.UserID.String(),
		RefreshToken: s.RefreshToken.String(),
		ExpiresAt:    s.ExpiresAt,
	}
}
