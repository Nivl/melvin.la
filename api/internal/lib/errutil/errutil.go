// Package errutil contains methods to simplify working with error
package errutil

import (
	"fmt"
	"log"
)

// Check call the provided method and sets the error to err if err is nil
// Deprecated: use CheckWithMessage instead
func Check(f func() error, err *error) { //nolint: gocritic // the pointer of pointer is on purpose so we can change the value if it's nil
	CheckWithMessage(f, err, "")
}

// CheckWithMessage call the provided method and sets the error to err
// if err is nil
func CheckWithMessage(f func() error, err *error, msg string) { //nolint: gocritic // the pointer of pointer is on purpose so we can change the value if it's nil
	if e := f(); e != nil {
		switch *err { //nolint: gocritic // no need to use errors.Is here since we're only checking for "is nil or not"
		case nil:
			wrappedErr := e
			if msg != "" {
				wrappedErr = fmt.Errorf("%s: %w", msg, e)
			}
			*err = wrappedErr
		default:
			log.Println("a check failed:", e)
		}
	}
}
