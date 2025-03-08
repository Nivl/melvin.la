package httpendpoint

import (
	"database/sql"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/Nivl/melvin.la/api/.gen/api-melvinla/public/model"
	"github.com/Nivl/melvin.la/api/.gen/api-melvinla/public/table"
	"github.com/Nivl/melvin.la/api/internal/lib/httputil"
	"github.com/Nivl/melvin.la/api/internal/lib/stringutil"
	"github.com/go-jet/jet/v2/postgres"

	"github.com/Nivl/melvin.la/api/internal/services/auth/payload"
	"github.com/Nivl/melvin.la/api/internal/uflib/ufhttputil"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
)

// CreateSessionInput represents the data needed to create a new user
type CreateSessionInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// NewCreateSessionInput parses, validates, and returns the user's input
func NewCreateSessionInput(c *ufhttputil.Context) (*CreateSessionInput, error) {
	input := new(CreateSessionInput)
	if err := c.Bind(input); err != nil {
		return nil, httputil.NewBadRequestError("invalid input")
	}

	// Sanitize
	input.Email = strings.TrimSpace(input.Email)
	// emails are stored lowercase in the DB to avoid issues with case
	input.Email = strings.ToLower(input.Email)

	// Validate
	if input.Password == "" {
		return nil, httputil.NewValidationError("password", "password is required")
	}
	// No need to validate if the email is valid, we'll check directly
	// with the database
	if input.Email == "" {
		return nil, httputil.NewValidationError("email", "email is required")
	}
	return input, nil
}

// SignedInUser represents a signed in user.
// This payload is returned after a successful sign in.
type SignedInUser struct {
	Session payload.Session `json:"session"`
	Me      payload.Me      `json:"me"`
}

// NewSignedInUser creates a new SignedInUser payload
func NewSignedInUser(u *model.Users, s *model.UserSessions) *SignedInUser {
	me := payload.NewMe(u)
	sess := payload.NewSession(s)

	siu := &SignedInUser{
		Me:      *me,
		Session: *sess,
	}

	return siu
}

// CreateSession controls that the user credentials are valid then creates and
// persists a new user session
func CreateSession(ec echo.Context) error {
	c, _ := ec.(*ufhttputil.Context)
	if c.User() != nil {
		return httputil.NewForbiddenError("User is already logged in")
	}
	input, err := NewCreateSessionInput(c)
	if err != nil {
		return err
	}

	// We first check if the email is valid, while retrieving the hashed
	// password
	var user model.Users
	err = table.Users.
		SELECT(table.Users.AllColumns).
		FROM(table.Users).
		WHERE(
			table.Users.Email.EQ(postgres.String(input.Email)).
				AND(table.Users.DeletedAt.IS_NULL()),
		).
		QueryContext(c.Request().Context(), c.DB(), &user)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return httputil.NewValidationError("_", "Invalid email or password")
		}
		return fmt.Errorf("could not get user: %w", err)
	}
	// With the hashed password we can now check if the provided one is valid
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password))
	if err != nil {
		return httputil.NewValidationError("_", "Invalid email or password")
	}

	// We can now create a new Session and return it to the user
	sess := &model.UserSessions{
		Token:        uuid.New(),
		UserID:       user.ID,
		RefreshToken: uuid.New(),
		ExpiresAt:    time.Now().Add(time.Hour * 24 * 7), // 7 days
		IPAddress:    stringutil.ToPointer(c.RealIP()),
		RefreshedAs:  nil,
	}
	_, err = table.UserSessions.
		INSERT(table.UserSessions.Token, table.UserSessions.UserID, table.UserSessions.RefreshToken, table.UserSessions.ExpiresAt, table.UserSessions.IPAddress).
		MODEL(sess).
		ExecContext(c.Request().Context(), c.DB())
	if err != nil {
		return fmt.Errorf("could not create session: %w", err)
	}

	return c.JSON(http.StatusCreated, NewSignedInUser(&user, sess))
}
