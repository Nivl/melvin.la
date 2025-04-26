package server

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"net/netip"
	"strings"
	"time"

	"github.com/Nivl/melvin.la/api/internal/gen/api"
	dbpublic "github.com/Nivl/melvin.la/api/internal/gen/sql"
	"github.com/Nivl/melvin.la/api/internal/lib/httputil/httperror"
	"github.com/Nivl/melvin.la/api/internal/payload"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/oapi-codegen/runtime/types"
	"golang.org/x/crypto/bcrypt"
)

func createSessionInputValidation(input *api.CreateSessionRequestObject) error {
	// emails are stored lowercase in the DB to avoid issues with case
	input.Body.Email = types.Email(strings.TrimSpace(string(input.Body.Email)))

	// validate
	if input.Body.Password == "" {
		return httperror.NewValidationError("password", "password is required")
	}
	if input.Body.Email == "" {
		return httperror.NewValidationError("email", "email is required")
	}
	return nil
}

// CreateSession is a user-facing HTTP endpoint used to create a user session
// This is used to log a user in
func (s *Server) CreateSession(ctx context.Context, input api.CreateSessionRequestObject) (api.CreateSessionResponseObject, error) {
	if err := createSessionInputValidation(&input); err != nil {
		return nil, err
	}
	c := s.GetServiceContext(ctx)

	// We first check if the email is valid, while retrieving the hashed
	// password
	user, err := c.DB().GetUserByEmail(ctx, string(input.Body.Email))
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, httperror.NewValidationError("_", "Invalid email or password")
		}
		return nil, fmt.Errorf("could not get user: %w", err)
	}
	// With the hashed password we can now check if the provided one is valid
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Body.Password))
	if err != nil {
		return nil, httperror.NewValidationError("_", "Invalid email or password")
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
		return nil, fmt.Errorf("could not create session: %w", err)
	}

	return api.CreateSession201JSONResponse{
		Me:      payload.NewUser(user),
		Session: payload.NewSession(sess),
	}, nil
}
