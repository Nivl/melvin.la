package payload

import (
	"time"

	"github.com/Nivl/melvin.la/api/internal/services/auth/models"
)

// Session represents a valid session for the user to use to login
type Session struct {
	ExpiresAt    time.Time `json:"expiresAt"`
	Token        string    `json:"token"`
	UserID       string    `json:"userId"`
	RefreshToken string    `json:"refreshToken"`
}

// NewSession creates a new Session payload
func NewSession(s *models.Session) *Session {
	return &Session{
		Token:        s.Token,
		UserID:       s.UserID,
		RefreshToken: s.RefreshToken,
		ExpiresAt:    s.ExpiresAt,
	}
}
