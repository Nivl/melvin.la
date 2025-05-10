package payload

import (
	"github.com/Nivl/melvin.la/api/internal/gen/api"
	dbpublic "github.com/Nivl/melvin.la/api/internal/gen/sql"
)

// NewBlogPost creates a BlogPost response object from SQL object
func NewBlogPost(p *dbpublic.BlogPost) api.BlogPost {
	publishedAt := &p.PublishedAt.Time
	if !p.PublishedAt.Valid {
		publishedAt = nil
	}

	return api.BlogPost{
		ID:           p.ID,
		Title:        p.Title,
		ContentJson:  p.ContentJSON,
		Description:  p.Description,
		PublishedAt:  publishedAt,
		Slug:         p.Slug,
		ThumbnailURL: p.ThumbnailURL,
	}
}

// NewBlogPosts creates a list BlogPost response object from SQL array
func NewBlogPosts(posts []*dbpublic.BlogPost) []api.BlogPost {
	result := make([]api.BlogPost, len(posts))
	for i, p := range posts {
		result[i] = NewBlogPost(p)
	}
	return result
}
