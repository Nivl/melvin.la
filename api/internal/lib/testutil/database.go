package testutil

import (
	"fmt"
	"os"
	"runtime"
	"strings"
	"sync"
	"testing"

	"github.com/Nivl/melvin.la/api/internal/lib/errutil"
	"github.com/google/uuid"
	"github.com/heetch/sqalx"
	"github.com/jmoiron/sqlx"

	_ "github.com/golang-migrate/migrate/v4/source/file" //nolint:revive,nolintlint // needed for migrations
	_ "github.com/jackc/pgx/v5/stdlib"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
)

//nolint:gochecknoglobals // needed for migrations
var (
	// dbLock is used to prevent concurrent create/update on the temporary table
	dbLock sync.Mutex

	// templateDBCreated is used to check if the template database has already
	// been created
	templateDBCreated = false

	// masterDBName holds the name of the default database
	masterDBName = ""

	// Every package is tested separately, meaning that init() or any global
	// will be called/reset multiple times evertime a new different using this
	// package. For this reason we need to use a non-deterministic name for the
	// template database.
	templateName = "test_template_" + strings.ReplaceAll(uuid.NewString(), "-", "")
)

func createTemplateDatabase(con sqalx.Node, dsn, migrationFolder string) (err error) {
	if templateDBCreated {
		return nil
	}

	// We get the current database name
	if err = con.Get(&masterDBName, "SELECT current_database();"); err != nil {
		return fmt.Errorf("failed getting master database name: %w", err)
	}

	// We drop whatever template exists
	stmt := fmt.Sprintf(`DROP DATABASE IF EXISTS %q;`, templateName)
	if _, err = con.Exec(stmt); err != nil {
		return err
	}

	// We create the template
	stmt = fmt.Sprintf(`CREATE DATABASE %q;`, templateName)
	if _, err = con.Exec(stmt); err != nil {
		return err
	}

	// We now need to connect to this database to create all the table. We
	// get the DSN of the current connection and swap the table name by
	// the new one
	masterDBString := fmt.Sprintf("/%s?", masterDBName)
	tplDBString := fmt.Sprintf("/%s?", templateName)
	tplDBDSN := strings.ReplaceAll(dsn, masterDBString, tplDBString)

	tplDB, err := sqlx.Connect("pgx", tplDBDSN)
	if err != nil {
		return fmt.Errorf("could not connect to the template table: %w", err)
	}
	tplDBNode, err := sqalx.New(tplDB.Unsafe())
	if err != nil {
		return fmt.Errorf("could not create template db node: %w", err)
	}
	defer errutil.Check(tplDBNode.Close, &err)
	driver, err := postgres.WithInstance(tplDB.Unsafe().DB, &postgres.Config{})
	if err != nil {
		return fmt.Errorf("could not create the driver: %w", err)
	}
	m, err := migrate.NewWithDatabaseInstance(
		"file://"+migrationFolder,
		"postgres", driver)
	if err != nil {
		return fmt.Errorf("could not new DB instance: %w", err)
	}
	defer func() {
		e1, e2 := m.Close()
		if err != nil {
			if e1 != nil {
				err = e1
			} else if e2 != nil {
				err = e2
			}
		}
	}()

	// We apply the migration to the newly created database
	if err := m.Up(); err != nil {
		return fmt.Errorf("could not create new migration: %w", err)
	}

	templateDBCreated = true
	return nil
}

// Wrapper is an helper to simplify the encapsulation of integration
// tests
type Wrapper struct {
	newDB sqalx.Node
	// masterDB contains a DB connection to the default database.
	// this is needed because postgres won't allow us to drop the
	// current database, so we use the default one to drop the
	// temporary one
	masterDB sqalx.Node
	// for the new table name we use a uuid without "-"
	tmpDBName string
}

// NewDB creates a new database connection to use in tests
func NewDB() (*Wrapper, error) {
	return NewDBWithPath("../../../../database/migrations")
}

// NewDBWithPath creates a new database connection to use in tests. The
// provided path will be used to apply the migration
func NewDBWithPath(migrationFolderPath string) (*Wrapper, error) {
	postgresURL := os.Getenv("API_POSTGRES_URL")
	if postgresURL == "" {
		postgresURL = "postgres://pguser:pguser@localhost:5432/api-melvinla?sslmode=disable"
	}
	db, err := sqlx.Connect("pgx", postgresURL)
	if err != nil {
		return nil, fmt.Errorf("couldn't connect to the DB: %w", err)
	}
	node, err := sqalx.New(db.Unsafe())
	if err != nil {
		db.Close()
		return nil, err
	}
	return NewTestDB(node, postgresURL, migrationFolderPath)
}

// NewTestDB creates a new database, sets it as the current database and returns
// a Wrapper object used to handle panics and clean up databases
func NewTestDB(db sqalx.Node, dsn, migrationFolder string) (wrapper *Wrapper, err error) { //nolint:nonamedreturns // false positive
	defer func() {
		if err != nil {
			db.Close()
		}
	}()

	dbLock.Lock()
	if err = createTemplateDatabase(db, dsn, migrationFolder); err != nil {
		dbLock.Unlock()
		return nil, err
	}
	dbLock.Unlock()

	tmpDBName := strings.ReplaceAll(uuid.NewString(), "-", "")
	// We create a new Database to avoid races between tests
	stmt := fmt.Sprintf(`CREATE DATABASE %q TEMPLATE %q;`, tmpDBName, templateName)
	if _, err = db.Exec(stmt); err != nil {
		return nil, fmt.Errorf("failed creating tmp database: %w", err)
	}

	// We set this new database as the new current one, to do that we
	// get the DSN of the current connection and swap the table name by
	// the new one
	masterDBString := fmt.Sprintf("/%s?", masterDBName)
	tmpDBString := fmt.Sprintf("/%s?", tmpDBName)
	tmpDBDSN := strings.ReplaceAll(dsn, masterDBString, tmpDBString)
	tmpDB, err := sqlx.Connect("pgx", tmpDBDSN)
	if err != nil {
		return nil, fmt.Errorf("could not connect to the tmp table: %w", err)
	}
	tmpDBNode, err := sqalx.New(tmpDB.Unsafe())
	if err != nil {
		return nil, fmt.Errorf("could not create db node: %w", err)
	}
	return &Wrapper{
		masterDB:  db,
		newDB:     tmpDBNode,
		tmpDBName: tmpDBName,
	}, nil
}

// DB returns the Database connection
func (it *Wrapper) DB() sqalx.Node { //nolint:ireturn // sqalx only returns interfaces
	return it.newDB
}

// Close cleans up the tests by deleting the database
func (it *Wrapper) Close() error {
	if err := it.newDB.Close(); err != nil {
		return err
	}
	stmt := fmt.Sprintf(`DROP DATABASE IF EXISTS %q;`, it.tmpDBName)
	if _, err := it.masterDB.Exec(stmt); err != nil {
		return err
	}
	return it.masterDB.Close()
}

// RecoverPanic prevents a panic from not calling the defer in the other goroutines
func (it *Wrapper) RecoverPanic(t *testing.T) {
	if rec := recover(); rec != nil {
		buf := make([]byte, 1<<16)
		stackSize := runtime.Stack(buf, false)
		t.Fatalf("%v\n%s", rec, string(buf[0:stackSize]))
	}
}

// CloseOnPanic cleans up the tests and re-panic
func (it *Wrapper) CloseOnPanic() {
	if rec := recover(); rec != nil {
		it.Close()
		panic(fmt.Sprintf("%v", rec))
	}
}
