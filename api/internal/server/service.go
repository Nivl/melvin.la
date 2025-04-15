package server

import "github.com/Nivl/melvin.la/api/internal/gen/api"

type Server struct{}

func NewServer() *Server {
	return &Server{}
}

var _ api.ServerInterface = (*Server)(nil)
