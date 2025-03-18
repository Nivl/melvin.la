// Package sqlutil contains methods and structs to help with SQL operations
package sqlutil

import (
	"context"

	dbpublic "github.com/Nivl/melvin.la/api/internal/gen/sql"
	pgx "github.com/jackc/pgx/v5"
)

type Querier interface {
	dbpublic.Querier
	WithTx(context.Context) (Trx, error)
}

type Trx interface {
	Querier
	Rollback(context.Context) error
	Commit(context.Context) error
}

type Queries struct {
	*dbpublic.Queries
	rawConn *pgx.Conn
}

func NewQuerier(q *dbpublic.Queries, conn *pgx.Conn) Querier {
	return &Queries{
		Queries: q,
		rawConn: conn,
	}
}

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

type Transaction struct {
	*dbpublic.Queries
	raw pgx.Tx
}

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

func (tx *Transaction) Rollback(ctx context.Context) error {
	return tx.raw.Rollback(ctx)
}

func (tx *Transaction) Commit(ctx context.Context) error {
	return tx.raw.Commit(ctx)
}
