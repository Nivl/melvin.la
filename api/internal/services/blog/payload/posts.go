package payload

import (
	"time"

	"github.com/Nivl/melvin.la/api/internal/services/blog"
	"github.com/Nivl/melvin.la/api/internal/services/blog/models"
)

// Post represents a blog post as returned by the API
type Post struct {
	PublishedAt  *time.Time           `json:"publishedAt,omitempty"`
	ContentJSON  *blog.EditorJSOutput `json:"contentJson,omitempty"`
	Description  *string              `json:"description,omitempty"`
	ThumbnailURL *string              `json:"thumbnailUrl,omitempty"`
	ID           string               `json:"id"`
	Title        string               `json:"title"`
	Slug         string               `json:"slug"`
}

// NewPost creates a new Post from a model
func NewPost(p *models.Post) *Post {
	return &Post{
		ID:           p.ID,
		Title:        p.Title,
		Slug:         p.Slug,
		ContentJSON:  p.ContentJSON,
		Description:  p.Description,
		ThumbnailURL: p.ThumbnailURL,
		PublishedAt:  p.PublishedAt,
	}
}

// NewPosts creates a new slice of Post from a slice of models
func NewPosts(m []*models.Post) []*Post {
	out := make([]*Post, 0, len(m))
	for _, v := range m {
		out = append(out, NewPost(v))
	}
	return out
}
