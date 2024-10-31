// Package fflag is used to process feature flags
package fflag

import (
	"context"
)

// FeatureFlag is an interface that represents a feature flag service.
// It allows to check if a feature flag is enabled or not.
type FeatureFlag interface {
	// IsEnabledOrTrue returns:
	// - true if the flag is enabled for this user
	// - false if the flag is disabled for this user
	// - defaultVal if we cannot determine the state of the flag,
	//   (network error)
	IsEnabled(ctx context.Context, name string, defaultVal bool) bool

	// With returns a new FeatureFlag that will use the given key and data
	// as context.
	// All other properties are kept
	With(key string, data map[string]interface{}) FeatureFlag

	// WithKey returns a new FeatureFlag that will use the given key
	// as context key.
	// All other properties are kept
	WithKey(key string) FeatureFlag

	// WithData returns a new FeatureFlag that will use the given data
	// as context.
	// All other properties are kept
	WithData(data map[string]interface{}) FeatureFlag

	// WithExtraData returns a new FeatureFlag that will contain a context
	// that has a merge of the given data in the current data.
	// All other properties are kept
	WithExtraData(data map[string]interface{}) FeatureFlag
}
