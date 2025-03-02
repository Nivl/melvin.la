package models

import (
	"context"
	"database/sql"

	"github.com/google/uuid"
	"github.com/heetch/sqalx"
)

// Revision represents a past revision of blog post as stored in the
// database.
type Revision struct {
	Post
	ID     string `db:"id"           json:"-"`
	PostID string `db:"blog_post_id" json:"-"`
}

// NewRevision creates a new Revision from a Post
func NewRevision(p *Post) *Revision {
	return &Revision{
		ID:     uuid.NewString(),
		PostID: p.ID,
		Post:   *p,
	}
}

// Insert inserts the user to the database
func (r *Revision) Insert(ctx context.Context, db sqalx.Node) (sql.Result, error) {
	if r.ID == "" {
		r.ID = uuid.NewString()
	}
	query := `
		INSERT INTO blog_post_revs
			(id, blog_post_id, title, content_json, description, thumbnail_url, slug)
		VALUES
			(:id, :blog_post_id, :title, :content_json, :description, :thumbnail_url, :slug)
	`
	return db.NamedExecContext(ctx, query, r)
}
