package server

import (
	"context"
	"strings"

	"github.com/Nivl/melvin.la/api/internal/gen/api"
)

func createSessionInputValidation(input *api.CreateSessionRequestObject) error {
	input.Body.Email = strings.TrimSpace(input.Body.Email)
}

func (s *Server) CreateSession(ctx context.Context, request api.CreateSessionRequestObject) (api.CreateSessionResponseObject, error) {
	sc := s.GetServiceContext(ctx)
	if err := createSessionInputValidation(&request); err != nil {
		return api.CreateSessionResponseObject{}, err
	}
	return api.CreateSession201JSONResponse{}, nil
}
