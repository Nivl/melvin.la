package stringutil_test

import (
	"testing"

	"github.com/Nivl/melvin.la/api/internal/lib/stringutil"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestToCamelCase(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected string
	}{
		{
			name:     "empty string",
			input:    "",
			expected: "",
		},
		{
			name:     "single word",
			input:    "hello",
			expected: "hello",
		},
		{
			name:     "multiple words",
			input:    "hello world",
			expected: "helloWorld",
		},
		{
			name:     "snake case",
			input:    "hello_world",
			expected: "helloWorld",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := stringutil.ToCamelCase(tt.input)
			assert.Equal(t, tt.expected, result)
		})
	}
}

func TestRandom(t *testing.T) {
	out := stringutil.Random(5)
	assert.NotEqual(t, t, stringutil.Random(5), "two random words shouldn't be the same")
	require.Len(t, out, 5, "A random string of len 5 should have a len of 5")
}
