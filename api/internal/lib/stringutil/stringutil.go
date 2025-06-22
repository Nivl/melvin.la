// Package stringutil contains utility functions for string manipulation.
package stringutil

import (
	"math/rand/v2"
	"strings"

	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

// The following chars has been removed to reduce the likelihood
// of generating bad words, or words hard to read:
// 0 1 2 5 A E I O U L N S Z
var charRunes = []rune("bcdfghjkmpqrtvwxyBCDFGHJKMPQRTVWXY346789")

// Random generates a random string of n characters
func Random(n int) string {
	b := make([]rune, n)
	for i := range b {
		b[i] = charRunes[rand.IntN(len(charRunes))] //nolint:gosec // No need for a strong random number generator
	}
	return string(b)
}

// ToCamelCase converts a snake_case string to a camelCase string
func ToCamelCase(s string) string {
	if s == "" {
		return s
	}

	firstChar := s[0]
	s = strings.ReplaceAll(s, "_", " ")
	s = cases.Title(language.AmericanEnglish).String(s)
	s = strings.ReplaceAll(s, " ", "")
	return string(firstChar) + s[1:]
}
