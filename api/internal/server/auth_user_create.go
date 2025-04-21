package server

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/Nivl/melvin.la/api/internal/gen/api"
	dbpublic "github.com/Nivl/melvin.la/api/internal/gen/sql"
	"github.com/Nivl/melvin.la/api/internal/lib/fflag"
	"github.com/Nivl/melvin.la/api/internal/lib/httputil/httperror"
	"github.com/google/uuid"
	"github.com/jackc/pgerrcode"
	"github.com/jackc/pgx/v5/pgconn"
	"golang.org/x/crypto/bcrypt"
)

func createUserInputValidation(input *api.CreateUserRequestObject) error {
	// Sanitize
	input.Body.Name = strings.TrimSpace(input.Body.Name)

	// validate
	if input.Body.Name == "" {
		return httperror.NewValidationError("name", "name is required")
	}
	if input.Body.Email == "" {
		return httperror.NewValidationError("email", "email is required")
	}
	if input.Body.Password == "" {
		return httperror.NewValidationError("password", "password is required")
	}
	return nil
}

func (s *Server) CreateUser(ctx context.Context, input api.CreateUserRequestObject) (api.CreateUserResponseObject, error) {
	c := s.GetServiceContext(ctx)

	// Most of the time we don't want people to sign up
	if c.FeatureFlag().IsEnabled(ctx, fflag.FlagEnableSignUps, false) {
		return nil, httperror.NewNotAvailable()
	}

	if c.User() != nil {
		return nil, httperror.NewForbiddenError("user is already logged in")
	}

	if err := createUserInputValidation(&input); err != nil {
		return nil, err
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
				return nil, httperror.NewConflictError(dbErr.ColumnName, "already in use")
			case pgerrcode.CheckViolation:
				return nil, httperror.NewValidationError(dbErr.ColumnName, "either too short or too long")
			}
		}
		return nil, fmt.Errorf("couldn't create new user: %w", err)
	}

	return api.CreateUser201Response{}, nil
}
