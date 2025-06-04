package server

import (
	"context"

	"github.com/Nivl/melvin.la/api/internal/gen/api"
)

// CreateSession is a user-facing HTTP endpoint used to create a user session
// This is used to log a user in
func (s *Server) FortniteGetStats(ctx context.Context, input api.FortniteGetStatsRequestObject) (api.FortniteGetStatsResponseObject, error) {
	// c := s.GetServiceContext(ctx)

	return nil, nil
}
