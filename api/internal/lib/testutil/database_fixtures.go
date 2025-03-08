package testutil

import (
	"context"
	"fmt"

	"github.com/Nivl/melvin.la/api/.gen/api-melvinla/public/model"
	"github.com/Nivl/melvin.la/api/.gen/api-melvinla/public/table"
	"github.com/google/uuid"
	"github.com/heetch/sqalx"
)

// InsertUsers add a bunch of users to the DB and returns them
func InsertUsers(ctx context.Context, db sqalx.Node) ([]*model.Users, error) {
	users := []*model.Users{
		{
			ID:       uuid.New(),
			Name:     "John Doe",
			Email:    "john.doe@domain.tld",
			Password: string("password"),
		},
	}
	_, err := table.Users.
		INSERT(table.Users.ID, table.Users.Name, table.Users.Email, table.Users.Password).
		MODELS(users).
		ExecContext(ctx, db)
	if err != nil {
		return nil, err
	}
	return users, nil
}

// DBFixtures corresponds to the data inserted in the DB
type DBFixtures struct {
	Users []*model.Users
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
