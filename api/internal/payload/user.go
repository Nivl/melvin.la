package payload

import (
	"github.com/Nivl/melvin.la/api/internal/gen/api"
	dbpublic "github.com/Nivl/melvin.la/api/internal/gen/sql"
	"github.com/oapi-codegen/runtime/types"
)

// NewUser creates a User response object from SQL object
func NewUser(u *dbpublic.User) api.User {
	return api.User{
		ID:    u.ID,
		Name:  u.Name,
		Email: types.Email(u.Email),
	}
}
