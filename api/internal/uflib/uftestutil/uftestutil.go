// Package uftestutil contains utilities methods and structs for user-facing
// testing.
package uftestutil

import (
	"testing"

	"github.com/Nivl/melvin.la/api/internal/lib/httputil"
	"github.com/Nivl/melvin.la/api/internal/lib/testutil"
	"github.com/Nivl/melvin.la/api/internal/services/auth/models"

	"github.com/Nivl/melvin.la/api/internal/uflib/ufhttputil"
)

// TestData contains all the data needed for a test
type TestData struct {
	*testutil.TestData
	User *models.User
}

// NewTest creates a new DB, a new HTTP context,  and adds a
// few important data to the DB.
func NewTest(t *testing.T, cfg testutil.TestConfig) *TestData {
	td := testutil.NewTest(t, cfg)

	c, _ := td.HTTP.(*httputil.Context)
	httpContext := &ufhttputil.Context{
		Context: c,
	}
	httpContext.SetUser(td.DBFixtures.Users[0])
	td.HTTP = httpContext

	return &TestData{
		TestData: td,
		User:     td.DBFixtures.Users[0],
	}
}
