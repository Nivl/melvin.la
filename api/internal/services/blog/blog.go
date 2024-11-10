// Package blog contains all the logic for the blog service.
package blog

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"
)

// EditorJSBlock represents a block from the EditorJS editor
// A block represents a single element, like a paragraph, a header,
// a codeblock, a list, etc.
type EditorJSBlock struct {
	ID   string          `json:"id"`
	Type string          `json:"type"`
	Data json.RawMessage `json:"data"`
}

// EditorJSOutput represents the output of the EditorJS editor
type EditorJSOutput struct {
	Version string          `json:"version"`
	Blocks  []EditorJSBlock `json:"blocks"`
	Time    int             `json:"time"`
}

// ErrUnknownType is returned when the type of the value is unknown
var ErrUnknownType = errors.New("unknown type")

// Scan implements the sql.Scanner interface
func (e *EditorJSOutput) Scan(val interface{}) error {
	switch v := val.(type) {
	case []byte:
		return json.Unmarshal(v, &e)
	case string:
		return json.Unmarshal([]byte(v), &e)
	default:
		return fmt.Errorf(`unsupported type "%T": %w`, v, ErrUnknownType)
	}
}

// Value implements the driver.Valuer interface
func (e *EditorJSOutput) Value() (driver.Value, error) {
	return json.Marshal(e)
}
