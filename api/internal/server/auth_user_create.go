package server

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/Nivl/melvin.la/api/internal/gen/api"
	dbpublic "github.com/Nivl/melvin.la/api/internal/gen/sql"
	"github.com/Nivl/melvin.la/api/internal/lib/fflag"
	"github.com/google/uuid"
	"github.com/jackc/pgerrcode"
	"github.com/jackc/pgx/v5/pgconn"
	"golang.org/x/crypto/bcrypt"
)

func createUserInputValidation(input *api.CreateUserRequestObject) *api.ErrorResponse {
	// Sanitize
	input.Body.Name = strings.TrimSpace(input.Body.Name)

	// validate
	if input.Body.Name == "" {
		return NewErrorResponse(http.StatusBadRequest, "name", "name is required", api.Body)
	}
	if input.Body.Email == "" {
		return NewErrorResponse(http.StatusBadRequest, "email", "email is required", api.Body)
	}
	if input.Body.Password == "" {
		return NewErrorResponse(http.StatusBadRequest, "password", "password is required", api.Body)
	}
	return nil
}

// CreateUser is a user-facing HTTP endpoint used to create a user
// This is used to sign up a new user
func (s *Server) CreateUser(ctx context.Context, input api.CreateUserRequestObject) (api.CreateUserResponseObject, error) {
	c := s.GetServiceContext(ctx)

	// Most of the time we don't want people to sign up
	if !c.FeatureFlag().IsEnabled(ctx, fflag.FlagEnableSignUps, false) {
		return api.CreateUser503JSONResponse(*NewShortErrorResponse(http.StatusServiceUnavailable, "Service Unavailable")), nil
	}

	if c.User() != nil {
		return api.CreateUser403JSONResponse(*NewShortErrorResponse(http.StatusForbidden, "Forbidden")), nil
	}

	if errorResponse := createUserInputValidation(&input); errorResponse != nil {
		return api.CreateUser400JSONResponse(*errorResponse), nil
	}

	// for sanity reasons, we store the emails lowercase, that'll be much
	// easier to deal with users that never types their email address the same way
	email := strings.ToLower(string(input.Body.Email))
	password, err := bcrypt.GenerateFromPassword([]byte(input.Body.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, fmt.Errorf("could not get a bcrypt hash from the password: %w", err)
	}
	_, err = c.DB().InsertUser(ctx, []dbpublic.InsertUserParams{
		{
			ID:             uuid.New(),
			Name:           input.Body.Name,
			Email:          email,
			Password:       string(password),
			PasswordCrypto: "bcrypt",
		},
	})
	if err != nil {
		var dbErr *pgconn.PgError
		if errors.As(err, &dbErr) {
			switch dbErr.Code {
			case pgerrcode.UniqueViolation:
				return api.CreateUser409JSONResponse(*NewErrorResponse(409, dbErr.ColumnName, "already in use", api.Body)), nil
			case pgerrcode.CheckViolation:
				return api.CreateUser400JSONResponse(*NewErrorResponse(400, dbErr.ColumnName, "either too short or too long", api.Body)), nil
			}
		}
		return nil, fmt.Errorf("couldn't create new user: %w", err)
	}

	return api.CreateUser201Response{}, nil
}
