package fflag

import (
	"context"
	"errors"
	"time"

	"github.com/launchdarkly/go-sdk-common/v3/ldcontext"
	"github.com/launchdarkly/go-sdk-common/v3/ldvalue"
	ld "github.com/launchdarkly/go-server-sdk/v7"
	"go.uber.org/zap"
)

type lauchDarky struct {
	client *ld.LDClient
	logger *zap.Logger

	ldCtxtData map[string]interface{}
	ldCtxKey   string
	ldCtx      ldcontext.Context
}

// NewLD creates a new FeatureFlag provider using Launch Darkly
func NewLD(key string, logger *zap.Logger) (FeatureFlag, error) {
	client, err := ld.MakeClient(key, 5*time.Second)
	if err != nil {
		if !errors.Is(err, ld.ErrInitializationTimeout) {
			return nil, err
		}
		// in case of timeout (LD is down for example), we don't want to
		// block the app from starting
		logger.Error("couldn't connect to Launch Darkly", zap.Error(err))
	}

	return &lauchDarky{
		client:     client,
		logger:     logger,
		ldCtx:      ldcontext.NewBuilder("anonymous").Anonymous(true).Build(),
		ldCtxKey:   "anonymous",
		ldCtxtData: map[string]interface{}{},
	}, nil
}

// IsEnabled returns:
// - true if the flag is enabled for this user
// - false if the flag is disabled for this user
// - defaultVal if we cannot determine the state of the flag (LD is down)
func (ff *lauchDarky) IsEnabled(ctx context.Context, name string, defaultVal bool) bool {
	if !ff.client.Initialized() {
		return defaultVal
	}

	res, err := ff.client.BoolVariationCtx(ctx, name, ff.ldCtx, defaultVal)
	if err != nil {
		ff.logger.Error("couldn't get flag value", zap.Error(err), zap.String("name", name))
		return defaultVal
	}

	return res
}

// With returns a new FeatureFlag that will use the given key and data
// as context.
// All other properties are kept
func (ff *lauchDarky) With(key string, data map[string]interface{}) FeatureFlag {
	ldCtx, newData := buildContext(key, data)
	return &lauchDarky{
		client:     ff.client,
		logger:     ff.logger,
		ldCtx:      ldCtx,
		ldCtxKey:   key,
		ldCtxtData: newData,
	}
}

// WithKey returns a new FeatureFlag that will use the given key
// as context key.
// All other properties are kept
func (ff *lauchDarky) WithKey(key string) FeatureFlag {
	ldCtx, newData := buildContext(key, ff.ldCtxtData)
	return &lauchDarky{
		client:     ff.client,
		logger:     ff.logger,
		ldCtx:      ldCtx,
		ldCtxKey:   ff.ldCtxKey,
		ldCtxtData: newData,
	}
}

// WithData returns a new FeatureFlag that will use the given data
// as context.
// All other properties are kept
func (ff *lauchDarky) WithData(data map[string]interface{}) FeatureFlag {
	ldCtx, newData := buildContext(ff.ldCtxKey, data)
	return &lauchDarky{
		client:     ff.client,
		logger:     ff.logger,
		ldCtx:      ldCtx,
		ldCtxKey:   ff.ldCtxKey,
		ldCtxtData: newData,
	}
}

// WithExtraData returns a new FeatureFlag that will contain a context
// that has a merge of the given data in the current data.
// All other properties are kept
func (ff *lauchDarky) WithExtraData(toAdd map[string]interface{}) FeatureFlag {
	ldCtx, newData := buildContext(ff.ldCtxKey, ff.ldCtxtData, toAdd)
	return &lauchDarky{
		client:     ff.client,
		logger:     ff.logger,
		ldCtx:      ldCtx,
		ldCtxKey:   ff.ldCtxKey,
		ldCtxtData: newData,
	}
}

// buildContext build a ld context using all the provided data.
// If multiple maps are provided, the last one will override the previous ones
func buildContext(key string, toAdd ...map[string]interface{}) (ldCtx ldcontext.Context, data map[string]interface{}) {
	data = map[string]interface{}{}
	builder := ldcontext.NewBuilder(key)
	for _, d := range toAdd {
		for k, v := range d {
			builder.SetValue(k, ldvalue.CopyArbitraryValue(v))
			data[k] = v
		}
	}
	return builder.Build(), data
}
