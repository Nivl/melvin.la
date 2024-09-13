package models

import (
	"time"

	"github.com/google/uuid"
)

// Session represents a user session as stored in the database.
type Session struct {
	ExpiresAt    time.Time     `db:"expires_at"    json:"-"`
	Token        string        `db:"token"         json:"-"`
	UserID       string        `db:"user_id"       json:"-"`
	RefreshToken string        `db:"refresh_token" json:"-"`
	IPAddress    string        `db:"ip_address"    json:"-"`
	RefreshedAs  uuid.NullUUID `db:"refreshed_as"  json:"-"`
}
