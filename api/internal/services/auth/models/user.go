package models

import (
	"context"
	"database/sql"

	"github.com/heetch/sqalx"
)

// User represents a user as stored in the database.
type User struct {
	ID       string `db:"id"       json:"-"`
	Name     string `db:"name"     json:"-"`
	Email    string `db:"email"    json:"-"`
	Password string `db:"password" json:"-"`
}

// Insert inserts the user to the database
func (u *User) Insert(ctx context.Context, db sqalx.Node) (sql.Result, error) {
	query := `
		INSERT INTO users
			(id, name, email, password, password_crypto)
		VALUES
			(:id, :name, :email, :password, 'bcrypt')
	`
	return db.NamedExecContext(ctx, query, u)
}

// Users represents a list of users as stored in the database.
type Users []*User

// Insert a multiple accounts at once to the database
func (u Users) Insert(ctx context.Context, db sqalx.Node) (sql.Result, error) {
	query := `
		INSERT INTO users
			(id, name, email, password, password_crypto)
		VALUES
			(:id, :name, :email, :password, 'bcrypt')
	`
	return db.NamedExecContext(ctx, query, u)
}
