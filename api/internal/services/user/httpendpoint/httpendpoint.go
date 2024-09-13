// Package httpendpoint provides the http endpoint for the financial service.
package httpendpoint

import "github.com/labstack/echo/v4"

// Register registers the service's routes
func Register(g *echo.Group, enableSignUp bool) {
	g.GET("/:id", GetUser)
	if enableSignUp {
		g.POST("", CreateUser)
	}
}
