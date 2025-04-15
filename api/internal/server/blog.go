package server

import (
	"github.com/Nivl/melvin.la/api/internal/gen/api"
	"github.com/labstack/echo/v4"
	openapi_types "github.com/oapi-codegen/runtime/types"
)

func (s *Server) DeleteBlogPost(ctx echo.Context, id openapi_types.UUID) error {
	return nil
}

func (s *Server) CreateBlogPost(ctx echo.Context) error {
	return nil
}

func (s *Server) GetBlogPosts(ctx echo.Context, params api.GetBlogPostsParams) error {
	return nil
}

func (s *Server) UpdateBlogPost(ctx echo.Context, id openapi_types.UUID) error {
	return nil
}

func (s *Server) GetBlogPost(ctx echo.Context, idOrSlug string) error {
	return nil
}
