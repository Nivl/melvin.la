package payload

import (
	"time"

	dbpublic "github.com/Nivl/melvin.la/api/internal/gen/sql"
	"github.com/Nivl/melvin.la/api/internal/services/blog"
)

// Post represents a blog post as returned by the API
type Post struct {
	PublishedAt  *time.Time          `json:"publishedAt,omitempty"`
	ContentJSON  blog.EditorJSOutput `json:"contentJson"`
	Description  *string             `json:"description,omitempty"`
	ThumbnailURL *string             `json:"thumbnailUrl,omitempty"`
	ID           string              `json:"id"`
	Title        string              `json:"title"`
	Slug         string              `json:"slug"`
}

// NewPost creates a new Post from a model
func NewPost(p *dbpublic.BlogPost) *Post {
	post := &Post{
		ID:           p.ID.String(),
		Title:        p.Title,
		Slug:         p.Slug,
		ContentJSON:  p.ContentJSON,
		Description:  p.Description,
		ThumbnailURL: p.ThumbnailURL,
		PublishedAt:  nil,
	}
	if p.PublishedAt.Valid {
		post.PublishedAt = &p.PublishedAt.Time
	}
	return post
}

// NewPosts creates a new slice of Post from a slice of models
func NewPosts(m []*dbpublic.BlogPost) []*Post {
	out := make([]*Post, 0, len(m))
	for _, v := range m {
		out = append(out, NewPost(v))
	}
	return out
}
