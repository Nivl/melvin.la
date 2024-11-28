// Package blog contains all the logic for the blog service.
package blog

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"
)

type EditorJSOutput struct {
	Version string          `json:"version"`
	Blocks  []EditorJSBlock `json:"blocks"`
	Time    int             `json:"time"`
}

func (e *EditorJSOutput) Scan(val interface{}) error {
	switch v := val.(type) {
	case []byte:
		json.Unmarshal(v, &e)
		return nil
	case string:
		json.Unmarshal([]byte(v), &e)
		return nil
	default:
		return errors.New(fmt.Sprintf("Unsupported type: %T", v))
	}
}

func (e *EditorJSOutput) Value() (driver.Value, error) {
	return json.Marshal(e)
}

type EditorJSBlock struct {
	ID   string          `json:"id"`
	Type string          `json:"type"`
	Data json.RawMessage `json:"data"`
}
