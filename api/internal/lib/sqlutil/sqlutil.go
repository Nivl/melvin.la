// Package sqlutil contains methods and structs to help with SQL operations
package sqlutil

import "database/sql"

// NewNullString returns a new sql.NullString based on whether the
// string is empty or not
func NewNullString(s string) sql.NullString {
	return sql.NullString{
		String: s,
		Valid:  s != "",
	}
}

// NewNullStringFromPtr returns a new sql.NullString based on whether the
// pointer has a non-nil/non-zero value or not
func NewNullStringFromPtr(s *string) sql.NullString {
	if s == nil || *s == "" {
		return sql.NullString{}
	}
	return sql.NullString{
		String: *s,
		Valid:  true,
	}
}
