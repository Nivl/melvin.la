package sqlutil

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/Nivl/melvin.la/api/internal/lib/errutil"
	"github.com/heetch/sqalx"
	"github.com/jmoiron/sqlx"
)

// NamedSelectContext binds a named query and then runs Query on the result using the
// provided connection and StructScans each row
func NamedSelectContext(ctx context.Context, db sqalx.Node, dest any, query string, arg interface{}) (err error) {
	stmt, err := db.PrepareNamedContext(ctx, query) //nolint:sqlclosecheck // false positive. it's done in the CheckWithMessage
	if err != nil {
		return fmt.Errorf("couldn't prepare the query: %w", err)
	}
	defer errutil.CheckWithMessage(stmt.Close, &err, "couldn't close the statement")
	return stmt.SelectContext(ctx, dest, arg)
}

// NamedGetContext binds a named query and then runs Query on the result using the
// provided connection and StructScan the row into dest.
func NamedGetContext(ctx context.Context, db sqalx.Node, dest any, query string, arg interface{}) (err error) {
	rows, err := sqlx.NamedQueryContext(ctx, db, query, arg) //nolint:sqlclosecheck // false positive. it's done in the CheckWithMessage
	if err != nil {
		return fmt.Errorf("NamedQueryContext: %w", err)
	}
	defer errutil.CheckWithMessage(rows.Close, &err, "couldn't close the row")
	if rows.Next() {
		return rows.StructScan(dest)
	}
	return sql.ErrNoRows
}
