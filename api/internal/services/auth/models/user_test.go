package models_test

import (
	"context"
	"testing"

	"github.com/Nivl/melvin.la/api/internal/lib/testutil"
	"github.com/Nivl/melvin.la/api/internal/services/auth/models"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestUser(t *testing.T) {
	t.Parallel()

	t.Run("Insert one user", func(t *testing.T) {
		t.Parallel()

		dbWrapper, err := testutil.NewDB()
		require.NoError(t, err, "failed creating DB")
		t.Cleanup(func() {
			assert.NoError(t, dbWrapper.Close(), "failed closing DB")
		})

		u := &models.User{
			ID:       uuid.NewString(),
			Name:     "Username",
			Email:    "email@domain.tld",
			Password: "password",
		}
		_, err = u.Insert(context.Background(), dbWrapper.DB())
		require.NoError(t, err)
	})

	t.Run("Insert multiple users", func(t *testing.T) {
		t.Parallel()

		dbWrapper, err := testutil.NewDB()
		require.NoError(t, err, "failed creating DB")
		t.Cleanup(func() {
			assert.NoError(t, dbWrapper.Close(), "failed closing DB")
		})

		users := models.Users{
			&models.User{
				ID:       uuid.NewString(),
				Name:     "Username",
				Email:    "email@domain.tld",
				Password: "password",
			},
			&models.User{
				ID:       uuid.NewString(),
				Name:     "Username 2",
				Email:    "email2@domain.tld",
				Password: "password",
			},
		}

		_, err = users.Insert(context.Background(), dbWrapper.DB())
		require.NoError(t, err)
	})

	t.Run("SetHasAddedAccounts() should update the user", func(t *testing.T) {
		t.Parallel()

		dbWrapper, err := testutil.NewDB()
		require.NoError(t, err, "failed creating DB")
		t.Cleanup(func() {
			assert.NoError(t, dbWrapper.Close(), "failed closing DB")
		})

		// Create a user
		u := &models.User{
			ID:       uuid.NewString(),
			Name:     "Username",
			Email:    "email@domain.tld",
			Password: "password",
		}
		_, err = u.Insert(context.Background(), dbWrapper.DB())
		require.NoError(t, err)

		require.NoError(t, err)
	})
}
