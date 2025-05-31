package httputil

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"path"
	"time"

	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
)

// StartAndWaitOpts is used to configure the HTTP server
type StartAndWaitOpts struct {
	// Callback is a function that will be called when the server is
	// shutting down
	Callback func()
	// Port is the port to use for the HTTP server
	// Defaults to 80 or 443 depending on the value of CertsPath
	Port string
	// CertsPath is the path to the certificates to use for HTTPS
	CertsPath string
}

// StartAndWaitWithCb starts the HTTP server and waits for a signal
// to shutdown. Once the signal triggers, the provided callback function is
// called.
func StartAndWaitWithCb(ctx context.Context, logger *zap.Logger, e *echo.Echo, opts StartAndWaitOpts) error {
	if opts.Callback == nil {
		opts.Callback = func() {}
	}
	if opts.Port == "" {
		switch opts.CertsPath {
		case "":
			opts.Port = "80"
		default:
			opts.Port = "443"
		}
	}

	go func() {
		var err error
		if opts.CertsPath == "" {
			err = e.Start(":" + opts.Port)
		} else {
			err = e.StartTLS(":"+opts.Port, path.Join(opts.CertsPath, "cert.pem"), path.Join(opts.CertsPath, "key.pem"))
		}
		if err != nil && !errors.Is(err, http.ErrServerClosed) {
			logger.Error("could not either start or stop the server.", zap.Error(err))
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)
	<-quit
	logger.Info("shutting the server down...")

	opts.Callback()

	// we give 10 seconds to the server to shutdown gracefully
	ctx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()
	if err := e.Shutdown(ctx); err != nil {
		return fmt.Errorf("couldn't shutdown: %w", err)
	}
	return nil
}
