package server

import (
	"strings"

	"github.com/Nivl/melvin.la/api/internal/gen/api"
	dbpublic "github.com/Nivl/melvin.la/api/internal/gen/sql"
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

func blogPostInputSanitizerAndValidation(input *BlogPostInput, existingPost dbpublic.BlogPost) *api.ErrorResponse {
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
			return NewErrorResponse("title", "title is required", api.Body)
		}
		if len(*input.Title) > 100 {
			return NewErrorResponse("title", "title must be 100 chars or less", api.Body)
		}
	}
	if input.Slug != nil && len(*input.Slug) > 105 {
		return NewErrorResponse("slug", "slug must be 105 chars or less", api.Body)
	}
	if input.Description != nil && len(*input.Description) > 130 {
		return NewErrorResponse("description", "description must be 130 chars or less", api.Body)
	}
	if input.ThumbnailURL != nil && len(*input.ThumbnailURL) > 255 {
		return NewErrorResponse("thumbnailUrl", "thumbnailUrl must be 255 chars or less", api.Body)
	}
	if input.ContentJSON != nil && len(input.ContentJSON.Blocks) == 0 {
		return NewErrorResponse("contentJson", "required", api.Body)
	}

	// If the post is meant to be published, or is currently published
	// we need to make sure all the required fields are present
	isPublished := input.Publish == nil && existingPost.PublishedAt.Valid
	willBePublished := input.Publish != nil && *input.Publish
	if isPublished || willBePublished {
		if !hasValue(input.ThumbnailURL, existingPost.ThumbnailURL) {
			return NewErrorResponse("thumbnailUrl", "required when publishing", api.Body)
		}
		if !hasValue(input.ThumbnailURL, existingPost.ThumbnailURL) ||
			(input.ContentJSON != nil && len(input.ContentJSON.Blocks) == 0) {
			return NewErrorResponse("contentJson", "required when publishing", api.Body)
		}
		if !hasValue(input.Description, existingPost.Description) {
			return NewErrorResponse("description", "required when publishing", api.Body)
		}
	}
	return nil
}
