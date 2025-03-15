package payload

import dbpublic "github.com/Nivl/melvin.la/api/internal/gen/sql"

// Me is a type representing the current user, that is safe to return
// to the client.
type Me struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

// NewMe returns a new Me payload that is used to return the current user
func NewMe(u *dbpublic.User) *Me {
	return &Me{
		ID:    u.ID.String(),
		Name:  u.Name,
		Email: u.Email,
	}
}
