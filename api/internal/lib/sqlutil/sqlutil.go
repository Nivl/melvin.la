// Package sqlutil contains methods and structs to help with SQL operations
package sqlutil

import (
	"context"

	dbpublic "github.com/Nivl/melvin.la/api/internal/gen/sql"
	pgx "github.com/jackc/pgx/v5"
)

// Querier is an interface that wraps the basic dbpublic.Querier methods
// And adds transactions support
type Querier interface {
	dbpublic.Querier
	WithTx(ctx context.Context) (Trx, error)
}

// Trx represents a SQL transaction
type Trx interface {
	Querier
	Rollback(ctx context.Context) error
	Commit(ctx context.Context) error
}

// Queries is a wrapper around dbpublic.Queries with extra
// transaction support
type Queries struct {
	*dbpublic.Queries
	rawConn *pgx.Conn
}

// NewQuerier creates a new Queries object that supports transactions
func NewQuerier(q *dbpublic.Queries, conn *pgx.Conn) Querier {
	return &Queries{
		Queries: q,
		rawConn: conn,
	}
}

// WithTx creates a new SQL transaction
func (q *Queries) WithTx(ctx context.Context) (Trx, error) {
	tx, err := q.rawConn.Begin(ctx)
	if err != nil {
		return nil, err
	}
	return &Transaction{
		Queries: q.Queries.WithTx(tx),
		raw:     tx,
	}, nil
}

// Transaction represents a SQL transaction
type Transaction struct {
	*dbpublic.Queries
	raw pgx.Tx
}

// WithTx creates a new nested transaction (savepoint)
func (tx *Transaction) WithTx(ctx context.Context) (Trx, error) {
	tx2, err := tx.raw.Begin(ctx)
	if err != nil {
		return nil, err
	}
	return &Transaction{
		Queries: tx.Queries.WithTx(tx2),
		raw:     tx2,
	}, nil
}

// Rollback rolls back the transaction
func (tx *Transaction) Rollback(ctx context.Context) error {
	return tx.raw.Rollback(ctx)
}

// Commit commits the transaction
func (tx *Transaction) Commit(ctx context.Context) error {
	return tx.raw.Commit(ctx)
}
