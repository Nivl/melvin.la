package httpendpoint

import (
	"database/sql"
	"errors"
	"fmt"
	"net/http"
	"net/netip"
	"strings"
	"time"

	dbpublic "github.com/Nivl/melvin.la/api/internal/gen/sql"
	"github.com/Nivl/melvin.la/api/internal/lib/httputil/httperror"
	"github.com/Nivl/melvin.la/api/internal/lib/httputil/request"
	"github.com/jackc/pgx/v5/pgtype"

	"github.com/Nivl/melvin.la/api/internal/services/auth/payload"
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
func NewCreateSessionInput(c *request.Context) (*CreateSessionInput, error) {
	input := new(CreateSessionInput)
	if err := c.Bind(input); err != nil {
		return nil, httperror.NewBadRequestError("invalid input")
	}

	// Sanitize
	input.Email = strings.TrimSpace(input.Email)
	// emails are stored lowercase in the DB to avoid issues with case
	input.Email = strings.ToLower(input.Email)

	// Validate
	if input.Password == "" {
		return nil, httperror.NewValidationError("password", "password is required")
	}
	// No need to validate if the email is valid, we'll check directly
	// with the database
	if input.Email == "" {
		return nil, httperror.NewValidationError("email", "email is required")
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
func NewSignedInUser(u *dbpublic.User, s *dbpublic.UserSession) *SignedInUser {
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
	c, _ := ec.(*request.Context)
	if c.User() != nil {
		return httperror.NewForbiddenError("User is already logged in")
	}
	ctx := c.Request().Context()
	input, err := NewCreateSessionInput(c)
	if err != nil {
		return err
	}

	// We first check if the email is valid, while retrieving the hashed
	// password
	user, err := c.DB().GetUserByEmail(ctx, input.Email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return httperror.NewValidationError("_", "Invalid email or password")
		}
		return fmt.Errorf("could not get user: %w", err)
	}
	// With the hashed password we can now check if the provided one is valid
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password))
	if err != nil {
		return httperror.NewValidationError("_", "Invalid email or password")
	}

	var ipPrefix netip.Prefix
	ipAddr, err := netip.ParseAddr(c.RealIP())
	if err != nil {
		c.Logger().Errorf("could not parse IP address: %s", err)
	} else {
		ipPrefix, err = ipAddr.Prefix(32)
		if err != nil {
			c.Logger().Errorf("could not extract IP prefix (32) for %s: %s", ipAddr.String(), err)
		}
	}

	// We can now create a new Session and return it to the user
	sess, err := c.DB().
		InsertUserSession(ctx, dbpublic.InsertUserSessionParams{
			Token:        uuid.New(),
			UserID:       user.ID,
			RefreshToken: uuid.New(),
			ExpiresAt: pgtype.Timestamptz{
				Time:  time.Now().Add(time.Hour * 24 * 7), // 7 days
				Valid: true,
			},
			IPAddress: &ipPrefix,
		})
	if err != nil {
		return fmt.Errorf("could not create session: %w", err)
	}

	return c.JSON(http.StatusCreated, NewSignedInUser(user, sess))
}
