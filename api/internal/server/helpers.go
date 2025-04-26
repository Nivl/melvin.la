package server

import (
	"strings"

	"github.com/Nivl/melvin.la/api/internal/gen/api"
	dbpublic "github.com/Nivl/melvin.la/api/internal/gen/sql"
	"github.com/Nivl/melvin.la/api/internal/lib/httputil/httperror"
)

// BlogPostInput is a generic input struct used to validate and sanitize
// user input for blog posts.
type BlogPostInput struct {
	ContentJSON  *api.EditorJS
	Description  *string
	Publish      *bool
	Slug         *string
	ThumbnailURL *string
	Title        *string
}

func hasValue(incoming, existing *string) bool {
	if incoming != nil && *incoming != "" {
		return true
	}
	return existing != nil && *existing != ""
}

func blogPostInputSanitizerAndValidation(input *BlogPostInput, existingPost dbpublic.BlogPost) error {
	// Sanitize
	if input.Title != nil {
		*input.Title = strings.TrimSpace(*input.Title)
	}
	if input.Description != nil {
		*input.Description = strings.TrimSpace(*input.Description)
	}
	if input.Slug != nil {
		*input.Slug = strings.TrimSpace(*input.Slug)
	}
	if input.ThumbnailURL != nil {
		*input.ThumbnailURL = strings.TrimSpace(*input.ThumbnailURL)
	}

	// Validate
	if input.Title != nil {
		if *input.Title == "" {
			return httperror.NewValidationError("title", "title is required")
		}
		if len(*input.Title) > 100 {
			return httperror.NewValidationError("title", "title must be 100 chars or less")
		}
	}
	if input.Slug != nil && len(*input.Slug) > 105 {
		return httperror.NewValidationError("slug", "slug must be 105 chars or less")
	}
	if input.Description != nil && len(*input.Description) > 130 {
		return httperror.NewValidationError("description", "description must be 130 chars or less")
	}
	if input.ThumbnailURL != nil && len(*input.ThumbnailURL) > 255 {
		return httperror.NewValidationError("thumbnail_url", "thumbnail_url must be 255 chars or less")
	}
	if input.ContentJSON != nil && len(input.ContentJSON.Blocks) == 0 {
		return httperror.NewValidationError("contentJson", "required")
	}

	// If the post is meant to be published, or is currently published
	// we need to make sure all the required fields are present
	isPublished := input.Publish == nil && existingPost.PublishedAt.Valid
	willBePublished := input.Publish != nil && *input.Publish
	if isPublished || willBePublished {
		if !hasValue(input.ThumbnailURL, existingPost.ThumbnailURL) {
			return httperror.NewValidationError("thumbnailUrl", "required when publishing")
		}
		if !hasValue(input.ThumbnailURL, existingPost.ThumbnailURL) ||
			(input.ContentJSON != nil && len(input.ContentJSON.Blocks) == 0) {
			return httperror.NewValidationError("contentJson", "required when publishing")
		}
		if !hasValue(input.Description, existingPost.Description) {
			return httperror.NewValidationError("description", "required when publishing")
		}
	}
	return nil
}
