package server

import (
	"context"
	"fmt"

	"github.com/Nivl/melvin.la/api/internal/gen/api"
	dbpublic "github.com/Nivl/melvin.la/api/internal/gen/sql"
	"github.com/Nivl/melvin.la/api/internal/lib/fflag"
	"github.com/Nivl/melvin.la/api/internal/lib/httputil/httperror"
	"github.com/Nivl/melvin.la/api/internal/payload"
	"github.com/jackc/pgx/v5/pgtype"
)

func getBlogPostsInputValidation(input api.GetBlogPostsRequestObject) error {
	// Workaround due to a bug in the generated code: https://github.com/oapi-codegen/oapi-codegen/pull/1957
	if input.Params.After == nil {
		input.Params.After = &pgtype.Timestamptz{}
	}
	if input.Params.Before == nil {
		input.Params.Before = &pgtype.Timestamptz{}
	}

	// Validate
	if !input.Params.After.Valid && !input.Params.Before.Valid {
		return httperror.NewValidationError("after", "after and before cannot be used together")
	}
	return nil
}

func (s *Server) GetBlogPosts(ctx context.Context, input api.GetBlogPostsRequestObject) (api.GetBlogPostsResponseObject, error) {
	c := s.GetServiceContext(ctx)

	// TODO(melvin): Move this to a middleware after the refactor
	if !c.FeatureFlag().IsEnabled(ctx, fflag.FlagEnableBlog, false) {
		return nil, httperror.NewNotAvailable()
	}

	if err := getBlogPostsInputValidation(input); err != nil {
		return nil, err
	}

	var err error
	var posts []*dbpublic.BlogPost
	if c.User() == nil {
		posts, err = c.DB().
			GetPublishedBlogPosts(ctx, dbpublic.GetPublishedBlogPostsParams{
				IsBefore:   input.Params.Before.Valid,
				BeforeDate: *input.Params.Before,
				IsAfter:    input.Params.After.Valid,
				AfterDate:  *input.Params.After,
			})
	} else {
		posts, err = c.DB().
			AdminGetBlogPosts(ctx, dbpublic.AdminGetBlogPostsParams{
				IsBefore:   input.Params.Before.Valid,
				BeforeDate: *input.Params.Before,
				IsAfter:    input.Params.After.Valid,
				AfterDate:  *input.Params.After,
			})
	}
	if err != nil {
		return nil, fmt.Errorf("could not retrieve posts: %w", err)
	}

	return api.GetBlogPosts200JSONResponse(payload.NewBlogPosts(posts)), nil
}
