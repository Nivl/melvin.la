package httpendpoint

import (
	"errors"
	"fmt"
	"net/http"
	"strings"

	dbpublic "github.com/Nivl/melvin.la/api/internal/gen/sql"
	"github.com/Nivl/melvin.la/api/internal/lib/fflag"
	"github.com/Nivl/melvin.la/api/internal/lib/httputil"
	"github.com/Nivl/melvin.la/api/internal/uflib/ufhttputil"
	"github.com/google/uuid"
	"github.com/jackc/pgerrcode"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
)

// CreateUserInput represents the data needed to create a new user
type CreateUserInput struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

// NewCreateUserInput parses, validates, and returns the user's input
func NewCreateUserInput(c *ufhttputil.Context) (*CreateUserInput, error) {
	input := new(CreateUserInput)
	if err := c.Bind(input); err != nil {
		return nil, httputil.NewBadRequestError("invalid input")
	}

	// Sanitize
	input.Name = strings.TrimSpace(input.Name)
	input.Email = strings.TrimSpace(input.Email)

	// Validate
	if input.Name == "" {
		return nil, httputil.NewValidationError("name", "name is required")
	}

	if input.Email == "" {
		return nil, httputil.NewValidationError("email", "email is required")
	}
	// we only go with the simplest check possible because that's enough
	// and it won't discriminate.
	if len(input.Email) < 3 || !strings.Contains(input.Email, "@") {
		return nil, httputil.NewValidationError("email", "not a valid email address")
	}

	if input.Password == "" {
		return nil, httputil.NewValidationError("password", "password is required")
	}
	return input, nil
}

// CreateUser creates a new user
// The current user must be logged out
func CreateUser(ec echo.Context) error {
	c, _ := ec.(*ufhttputil.Context)
	ctx := c.Request().Context()

	// Most of the time we don't want people to sign up
	if c.FeatureFlag().IsEnabled(ec.Request().Context(), fflag.FlagEnableSignUps, false) {
		return httputil.NewNotFoundError()
	}

	if c.User() != nil {
		return httputil.NewForbiddenError("user is already logged in")
	}
	input, err := NewCreateUserInput(c)
	if err != nil {
		return err
	}

	// for sanity reasons, we store the emails lowercase, that'll be much
	// easier to deal with users that never types their email address the same way
	email := strings.ToLower(input.Email)
	password, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("could not get a bcrypt hash from the password: %w", err)
	}

	_, err = c.DB().InsertUser(ctx, []dbpublic.InsertUserParams{
		{
			ID:             uuid.New(),
			Name:           input.Name,
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
				return httputil.NewConflictError(dbErr.ColumnName, "already in use")
			case pgerrcode.CheckViolation:
				return httputil.NewValidationError(dbErr.ColumnName, "either too short or too long")
			}
		}
		return fmt.Errorf("couldn't create new user: %w", err)
	}

	return c.NoContent(http.StatusCreated)
}
