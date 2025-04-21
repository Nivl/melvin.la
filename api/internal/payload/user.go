package payload

import (
	"github.com/Nivl/melvin.la/api/internal/gen/api"
	dbpublic "github.com/Nivl/melvin.la/api/internal/gen/sql"
	"github.com/oapi-codegen/runtime/types"
)

func NewUser(u *dbpublic.User) api.User {
	return api.User{
		Id:    u.ID,
		Name:  u.Name,
		Email: types.Email(u.Email),
	}
}
