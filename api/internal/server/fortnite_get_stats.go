package server

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/Nivl/melvin.la/api/internal/gen/api"
	"github.com/Nivl/melvin.la/api/internal/lib/errutil"
	"github.com/Nivl/melvin.la/api/internal/lib/secret"
)

// FortniteGetStats is a user-facing HTTP endpoint used to get a user's
// Fortnite stats
func (s *Server) FortniteGetStats(ctx context.Context, input api.FortniteGetStatsRequestObject) (response api.FortniteGetStatsResponseObject, err error) {
	// Validate
	input.Username = strings.TrimSpace(input.Username)
	if input.Username == "" {
		return api.FortniteGetStats400JSONResponse(*NewErrorResponse(http.StatusBadRequest, "username", "invalid value", api.Path)), nil
	}

	// Fetch the data
	req, err := statsRequest(ctx, input, s.fortniteAPIKey)
	if err != nil {
		return nil, err
	}
	res, err := s.http.Do(req) //nolint:bodyclose // We close the body in RunAndSetError
	if err != nil {
		return nil, fmt.Errorf("failed to fetch Fortnite stats: %w", err)
	}
	defer io.ReadAll(res.Body) //nolint:errcheck // We just want to flush it
	defer errutil.RunAndSetError(res.Body.Close, &err, "failed to close response body")

	// Process
	switch res.StatusCode {
	case http.StatusForbidden:
		return api.FortniteGetStats403JSONResponse(*NewShortErrorResponse(http.StatusForbidden, "The player's account is private")), nil
	case http.StatusNotFound:
		return api.FortniteGetStats404JSONResponse(*NewShortErrorResponse(http.StatusNotFound, "Not Found")), nil
	case http.StatusOK:
		var fortniteStats api.FortniteStats
		if err := json.NewDecoder(res.Body).Decode(&fortniteStats); err != nil {
			return nil, fmt.Errorf("failed to decode Fortnite stats: %w", err)
		}
		return api.FortniteGetStats200JSONResponse(fortniteStats), nil
	default:
		return nil, fmt.Errorf("unexpected status code from fortnite-api: %d", res.StatusCode) //nolint:err113 // no need for a custom error
	}
}

func statsRequest(ctx context.Context, input api.FortniteGetStatsRequestObject, apiKey secret.Secret) (*http.Request, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, "https://fortnite-api.com/v2/stats/br/v2", http.NoBody)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	q := req.URL.Query()
	q.Set("name", input.Username)
	q.Set("accountType", string(input.Platform))
	q.Set("timeWindow", string(input.TimeWindow))
	req.URL.RawQuery = q.Encode()

	req.Header.Set("Authorization", apiKey.Get())
	return req, nil
}
