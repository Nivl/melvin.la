// Package testutil contains utilities methods and structs for testing.
package testutil

import (
	"context"
	"io"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/Nivl/melvin.la/api/internal/lib/httputil"

	dbpublic "github.com/Nivl/melvin.la/api/internal/gen/sql"
	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"go.uber.org/mock/gomock"
	"go.uber.org/zap"
	"go.uber.org/zap/zaptest/observer"
)

// NewHTTP returns a new gin context to use for the tests
func NewHTTP(method, target string, body io.Reader) (echo.Context, *httptest.ResponseRecorder) {
	e := echo.New()
	req := httptest.NewRequest(method, target, body)
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	return e.NewContext(req, rec), rec
}

// TestData contains all the data needed for a test
type TestData struct {
	HTTP       echo.Context
	DB         *Wrapper
	Logs       *observer.ObservedLogs
	Logger     *zap.Logger
	MockCtrl   *gomock.Controller
	HTTPRec    *httptest.ResponseRecorder
	DBFixtures *DBFixtures
}

// TestConfig correspond to the test config needed to create a test
type TestConfig struct {
	HTTPBody            func(*DBFixtures) io.Reader `exhaustruct:"optional"`
	HTTPParams          func(*DBFixtures) []string  `exhaustruct:"optional"`
	MigrationFolderPath string                      `exhaustruct:"optional"`
	HTTPMethod          string                      `exhaustruct:"optional"`
}

// NewTest creates a new DB, a new HTTP context, and adds a few
// important data to the DB.
func NewTest(t *testing.T, cfg TestConfig) *TestData {
	if cfg.MigrationFolderPath == "" {
		cfg.MigrationFolderPath = "../../../../database/migrations"
	}

	// DB
	dbWrapper, err := NewDBWithPath(cfg.MigrationFolderPath)
	require.NoError(t, err, "failed creating DB")
	t.Cleanup(func() {
		assert.NoError(t, dbWrapper.Close(), "failed closing DB")
	})

	// Logs
	observedZapCore, observedLogs := observer.New(zap.DebugLevel)
	logger := zap.New(observedZapCore)

	// Mocks
	ctrl := gomock.NewController(t)
	t.Cleanup(func() {
		ctrl.Finish()
	})

	if cfg.HTTPParams == nil {
		cfg.HTTPParams = func(_ *DBFixtures) []string {
			return []string{}
		}
	}
	if cfg.HTTPBody == nil {
		cfg.HTTPBody = func(_ *DBFixtures) io.Reader {
			return nil
		}
	}

	fx, err := InsertAllFixtures(context.Background(), dbWrapper.DB())
	require.NoError(t, err, "failed inserting Users")

	// HTTP
	ec, rec := NewHTTP(cfg.HTTPMethod, "/?"+strings.Join(cfg.HTTPParams(fx), "&"), cfg.HTTPBody(fx))
	c := &httputil.Context{
		Context: &httputil.Context{Context: ec},
	}
	c.SetDB(dbpublic.New(dbWrapper.DB()))
	c.SetLog(logger)

	return &TestData{
		DB:         dbWrapper,
		HTTP:       c,
		Logs:       observedLogs,
		Logger:     logger,
		MockCtrl:   ctrl,
		HTTPRec:    rec,
		DBFixtures: fx,
	}
}
