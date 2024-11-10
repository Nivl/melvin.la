// Package httpendpoint provides the http endpoint for the financial service.
package httpendpoint

import (
	"github.com/labstack/echo/v4"
)

// Register registers the service's routes
func Register(g *echo.Group) {
	g.GET("/posts", GetPosts)
	g.GET("/posts/:slug", GetPost)
	g.POST("/posts", CreatePost)
	g.PATCH("/posts/:id", UpdatePost)
	g.DELETE("/posts", DeletePost)
}
