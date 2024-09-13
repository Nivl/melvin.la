package testutil

import (
	"context"
	"fmt"

	"github.com/Nivl/melvin.la/api/internal/services/auth/models"
	"github.com/google/uuid"
	"github.com/heetch/sqalx"
)

// InsertUsers add a bunch of users to the DB and returns them
func InsertUsers(ctx context.Context, db sqalx.Node) (models.Users, error) {
	u := models.Users{
		&models.User{
			ID:       uuid.New().String(),
			Name:     "John Doe",
			Email:    "john.doe@domain.tld",
			Password: string("password"),
		},
	}
	if _, err := u.Insert(ctx, db); err != nil {
		return nil, err
	}
	return u, nil
}

// DBFixtures corresponds to the data inserted in the DB
type DBFixtures struct {
	Users models.Users
}

// InsertAllFixtures add a bunch of data to the database
func InsertAllFixtures(ctx context.Context, db sqalx.Node) (*DBFixtures, error) {
	fx := new(DBFixtures)
	var err error

	fx.Users, err = InsertUsers(ctx, db)
	if err != nil {
		return nil, fmt.Errorf("could not insert users: %w", err)
	}

	return fx, nil
}
