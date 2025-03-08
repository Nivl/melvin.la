package payload

import "github.com/Nivl/melvin.la/api/.gen/api-melvinla/public/model"

// Me is a type representing the current user, that is safe to return
// to the client.
type Me struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

// NewMe returns a new Me payload that is used to return the current user
func NewMe(u *model.Users) *Me {
	return &Me{
		ID:    u.ID.String(),
		Name:  u.Name,
		Email: u.Email,
	}
}
