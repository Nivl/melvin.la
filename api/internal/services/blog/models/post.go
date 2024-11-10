package models

import (
	"context"
	"database/sql"
	"time"

	"github.com/Nivl/melvin.la/api/internal/services/blog"
	"github.com/google/uuid"
	"github.com/heetch/sqalx"
)

// Post represents a blog post as stored in the database.
type Post struct {
	PublishedAt  *time.Time           `db:"published_at"  json:"-"`
	Description  *string              `db:"description"   json:"-"`
	ThumbnailURL *string              `db:"thumbnail_url" json:"-"`
	ContentJSON  *blog.EditorJSOutput `db:"content_json"  json:"-"`
	Slug         string               `db:"slug"          json:"-"`
	ID           string               `db:"id"            json:"-"`
	Title        string               `db:"title"         json:"-"`
}

// Insert inserts the post to the database
func (p *Post) Insert(ctx context.Context, db sqalx.Node) (sql.Result, error) {
	if p.ID == "" {
		p.ID = uuid.NewString()
	}
	query := `
		INSERT INTO blog_posts
			(id, title, description, slug, thumbnail_url, content_json, published_at)
		VALUES
			(:id, :title, :description, :slug, :thumbnail_url, :content_json, :published_at)
	`
	return db.NamedExecContext(ctx, query, p)
}

// Update updates the post entry to the database
func (p *Post) Update(ctx context.Context, db sqalx.Node) (sql.Result, error) {
	query := `
		UPDATE blog_posts
		SET
			title = :title,
			slug = :slug,
			description = :description,
			thumbnail_url = :thumbnail_url,
			content_json = :content_json,
			published_at = :published_at,
			updated_at = NOW()
		WHERE
			id = :id
	`
	return db.NamedExecContext(ctx, query, p)
}
