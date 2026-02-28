package middleware_test

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Nivl/melvin.la/api/internal/gen/api"
	"github.com/Nivl/melvin.la/api/internal/lib/httpserver/middleware"
	"github.com/Nivl/melvin.la/api/internal/lib/httpserver/request"
	"github.com/getsentry/sentry-go"
	"github.com/labstack/echo/v5"
	"github.com/pb33f/libopenapi"
	verror "github.com/pb33f/libopenapi-validator/errors"
	vhelpers "github.com/pb33f/libopenapi-validator/helpers"
	"github.com/pb33f/libopenapi-validator/parameters"
	"github.com/pb33f/libopenapi-validator/requests"
	"github.com/pb33f/libopenapi-validator/responses"
	v3 "github.com/pb33f/libopenapi/datamodel/high/v3"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

type mockValidator struct {
	isValid          bool
	validationErrors []*verror.ValidationError
}

//nolint:revive // Method names come from external validator interface
func (m *mockValidator) ValidateHttpRequest(r *http.Request) (bool, []*verror.ValidationError) {
	return m.isValid, m.validationErrors
}

//nolint:revive // Method names come from external validator interface
func (m *mockValidator) ValidateHttpRequestSync(r *http.Request) (bool, []*verror.ValidationError) {
	return m.isValid, m.validationErrors
}

//nolint:revive // Method names come from external validator interface
func (m *mockValidator) ValidateHttpRequestWithPathItem(r *http.Request, pathItem *v3.PathItem, pathValue string) (bool, []*verror.ValidationError) {
	return m.isValid, m.validationErrors
}

//nolint:revive // Method names come from external validator interface
func (m *mockValidator) ValidateHttpRequestSyncWithPathItem(r *http.Request, pathItem *v3.PathItem, pathValue string) (bool, []*verror.ValidationError) {
	return m.isValid, m.validationErrors
}

//nolint:revive // Method names come from external validator interface
func (m *mockValidator) ValidateHttpResponse(r *http.Request, resp *http.Response) (bool, []*verror.ValidationError) {
	return m.isValid, m.validationErrors
}

//nolint:revive // Method names come from external validator interface
func (m *mockValidator) ValidateHttpRequestResponse(r *http.Request, resp *http.Response) (bool, []*verror.ValidationError) {
	return m.isValid, m.validationErrors
}

func (m *mockValidator) ValidateDocument() (bool, []*verror.ValidationError) {
	return true, nil
}

func (m *mockValidator) GetParameterValidator() parameters.ParameterValidator {
	return nil
}

func (m *mockValidator) GetRequestBodyValidator() requests.RequestBodyValidator {
	return nil
}

func (m *mockValidator) GetResponseBodyValidator() responses.ResponseBodyValidator {
	return nil
}

func (m *mockValidator) SetDocument(_ libopenapi.Document) {}

func setupTest() (*echo.Echo, *httptest.ResponseRecorder) {
	e := echo.New()
	rec := httptest.NewRecorder()
	return e, rec
}

func parseErrorResponse(t *testing.T, body io.Reader) *api.ErrorResponse {
	var errResp api.ErrorResponse
	err := json.NewDecoder(body).Decode(&errResp)
	require.NoError(t, err)
	return &errResp
}

func createTestContext(e *echo.Echo, req *http.Request, rec *httptest.ResponseRecorder) *request.Context {
	ec := e.NewContext(req, rec)
	c := &request.Context{
		Context: ec,
	}
	logger := sentry.NewLogger(req.Context())
	c.SetLog(logger)
	return c
}

func TestValidation_ValidRequest(t *testing.T) {
	e, rec := setupTest()

	mockVal := &mockValidator{
		isValid:          true,
		validationErrors: nil,
	}

	req := httptest.NewRequest(http.MethodGet, "/test", http.NoBody)
	c := e.NewContext(req, rec)

	handler := middleware.Validation(mockVal)(func(c echo.Context) error {
		return c.String(http.StatusOK, "success")
	})

	err := handler(c)
	require.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)
	assert.Equal(t, "success", rec.Body.String())
}

func TestValidation_SecurityValidation(t *testing.T) {
	e, rec := setupTest()

	mockVal := &mockValidator{
		isValid: false,
		validationErrors: []*verror.ValidationError{
			{
				ValidationType: vhelpers.SecurityValidation,
				ParameterName:  "X-Api-Key",
				HowToFix:       "unauthorized",
			},
		},
	}

	req := httptest.NewRequest(http.MethodGet, "/test", http.NoBody)
	c := createTestContext(e, req, rec)

	handler := middleware.Validation(mockVal)(func(c echo.Context) error {
		return c.String(http.StatusOK, "should not reach here")
	})

	err := handler(c)
	require.NoError(t, err)
	assert.Equal(t, http.StatusUnauthorized, rec.Code)

	errResp := parseErrorResponse(t, rec.Body)
	assert.Equal(t, http.StatusUnauthorized, errResp.Code)
	assert.Equal(t, "unauthorized", errResp.Message)
	require.NotNil(t, errResp.Field)
	assert.Equal(t, "X-Api-Key", *errResp.Field) // ToCamelCase doesn't convert hyphens
	require.NotNil(t, errResp.Location)
	assert.Equal(t, api.Header, *errResp.Location)
}

func TestValidation_PathValidation(t *testing.T) {
	e, rec := setupTest()

	mockVal := &mockValidator{
		isValid: false,
		validationErrors: []*verror.ValidationError{
			{
				ValidationType: vhelpers.Path,
				HowToFix:       "not found",
			},
		},
	}

	req := httptest.NewRequest(http.MethodGet, "/invalid-path", http.NoBody)
	c := createTestContext(e, req, rec)

	handler := middleware.Validation(mockVal)(func(c echo.Context) error {
		return c.String(http.StatusOK, "should not reach here")
	})

	err := handler(c)
	require.NoError(t, err)
	assert.Equal(t, http.StatusNotFound, rec.Code)

	errResp := parseErrorResponse(t, rec.Body)
	assert.Equal(t, http.StatusNotFound, errResp.Code)
	assert.Equal(t, "not found", errResp.Message)
	assert.Nil(t, errResp.Field)
	assert.Nil(t, errResp.Location)
}

func TestValidation_RequestBodyValidation(t *testing.T) {
	e, rec := setupTest()

	mockVal := &mockValidator{
		isValid: false,
		validationErrors: []*verror.ValidationError{
			{
				ValidationType: vhelpers.RequestBodyValidation,
				ParameterName:  "body",
				HowToFix:       "invalid request body",
				SchemaValidationErrors: []*verror.SchemaValidationFailure{
					{
						FieldName: "username",
						Reason:    "username is required",
					},
				},
			},
		},
	}

	body := bytes.NewBufferString(`{"invalid": "data"}`)
	req := httptest.NewRequest(http.MethodPost, "/test", body)
	req.Header.Set("Content-Type", "application/json")
	c := createTestContext(e, req, rec)

	handler := middleware.Validation(mockVal)(func(c echo.Context) error {
		return c.String(http.StatusOK, "should not reach here")
	})

	err := handler(c)
	require.NoError(t, err)
	assert.Equal(t, http.StatusBadRequest, rec.Code)

	errResp := parseErrorResponse(t, rec.Body)
	assert.Equal(t, http.StatusBadRequest, errResp.Code)
	assert.Equal(t, "username is required", errResp.Message)
	require.NotNil(t, errResp.Field)
	assert.Equal(t, "username", *errResp.Field)
	require.NotNil(t, errResp.Location)
	assert.Equal(t, api.Body, *errResp.Location)
}

func TestValidation_RequestBodyValidation_NoSchemaErrors(t *testing.T) {
	e, rec := setupTest()

	mockVal := &mockValidator{
		isValid: false,
		validationErrors: []*verror.ValidationError{
			{
				ValidationType:         vhelpers.RequestBodyValidation,
				ParameterName:          "body",
				HowToFix:               "invalid request body",
				SchemaValidationErrors: nil,
			},
		},
	}

	body := bytes.NewBufferString(`{"invalid": "data"}`)
	req := httptest.NewRequest(http.MethodPost, "/test", body)
	req.Header.Set("Content-Type", "application/json")
	c := createTestContext(e, req, rec)

	handler := middleware.Validation(mockVal)(func(c echo.Context) error {
		return c.String(http.StatusOK, "should not reach here")
	})

	err := handler(c)
	require.NoError(t, err)
	assert.Equal(t, http.StatusBadRequest, rec.Code)

	errResp := parseErrorResponse(t, rec.Body)
	assert.Equal(t, http.StatusBadRequest, errResp.Code)
	assert.Equal(t, "invalid request body", errResp.Message)
	require.NotNil(t, errResp.Field)
	assert.Equal(t, "body", *errResp.Field)
	require.NotNil(t, errResp.Location)
	assert.Equal(t, api.Body, *errResp.Location)
}

func TestValidation_ParameterValidation_Query(t *testing.T) {
	e, rec := setupTest()

	mockVal := &mockValidator{
		isValid: false,
		validationErrors: []*verror.ValidationError{
			{
				ValidationType:    vhelpers.ParameterValidation,
				ValidationSubType: "query",
				ParameterName:     "page_size",
				HowToFix:          "page_size must be between 1 and 100",
			},
		},
	}

	req := httptest.NewRequest(http.MethodGet, "/test?page_size=200", http.NoBody)
	c := createTestContext(e, req, rec)

	handler := middleware.Validation(mockVal)(func(c echo.Context) error {
		return c.String(http.StatusOK, "should not reach here")
	})

	err := handler(c)
	require.NoError(t, err)
	assert.Equal(t, http.StatusBadRequest, rec.Code)

	errResp := parseErrorResponse(t, rec.Body)
	assert.Equal(t, http.StatusBadRequest, errResp.Code)
	assert.Equal(t, "page_size must be between 1 and 100", errResp.Message)
	require.NotNil(t, errResp.Field)
	assert.Equal(t, "pageSize", *errResp.Field)
	require.NotNil(t, errResp.Location)
	assert.Equal(t, api.Query, *errResp.Location)
}

func TestValidation_ParameterValidation_Header(t *testing.T) {
	e, rec := setupTest()

	mockVal := &mockValidator{
		isValid: false,
		validationErrors: []*verror.ValidationError{
			{
				ValidationType:    vhelpers.ParameterValidation,
				ValidationSubType: "header",
				ParameterName:     "X-Custom-Header",
				HowToFix:          "header is required",
			},
		},
	}

	req := httptest.NewRequest(http.MethodGet, "/test", http.NoBody)
	c := createTestContext(e, req, rec)

	handler := middleware.Validation(mockVal)(func(c echo.Context) error {
		return c.String(http.StatusOK, "should not reach here")
	})

	err := handler(c)
	require.NoError(t, err)
	assert.Equal(t, http.StatusBadRequest, rec.Code)

	errResp := parseErrorResponse(t, rec.Body)
	assert.Equal(t, http.StatusBadRequest, errResp.Code)
	assert.Equal(t, "header is required", errResp.Message)
	require.NotNil(t, errResp.Field)
	assert.Equal(t, "X-Custom-Header", *errResp.Field) // ToCamelCase doesn't convert hyphens
	require.NotNil(t, errResp.Location)
	assert.Equal(t, api.Header, *errResp.Location)
}

func TestValidation_ParameterValidation_Path(t *testing.T) {
	e, rec := setupTest()

	mockVal := &mockValidator{
		isValid: false,
		validationErrors: []*verror.ValidationError{
			{
				ValidationType:    vhelpers.ParameterValidation,
				ValidationSubType: "path",
				ParameterName:     "user_id",
				HowToFix:          "user_id must be a valid UUID",
			},
		},
	}

	req := httptest.NewRequest(http.MethodGet, "/users/invalid-id", http.NoBody)
	c := createTestContext(e, req, rec)

	handler := middleware.Validation(mockVal)(func(c echo.Context) error {
		return c.String(http.StatusOK, "should not reach here")
	})

	err := handler(c)
	require.NoError(t, err)
	assert.Equal(t, http.StatusBadRequest, rec.Code)

	errResp := parseErrorResponse(t, rec.Body)
	assert.Equal(t, http.StatusBadRequest, errResp.Code)
	assert.Equal(t, "user_id must be a valid UUID", errResp.Message)
	require.NotNil(t, errResp.Field)
	assert.Equal(t, "userId", *errResp.Field)
	require.NotNil(t, errResp.Location)
	assert.Equal(t, api.Path, *errResp.Location)
}

func TestValidation_ParameterValidation_Cookie(t *testing.T) {
	e, rec := setupTest()

	mockVal := &mockValidator{
		isValid: false,
		validationErrors: []*verror.ValidationError{
			{
				ValidationType:    vhelpers.ParameterValidation,
				ValidationSubType: "cookie",
				ParameterName:     "session_id",
				HowToFix:          "session_id cookie is required",
			},
		},
	}

	req := httptest.NewRequest(http.MethodGet, "/test", http.NoBody)
	c := createTestContext(e, req, rec)

	handler := middleware.Validation(mockVal)(func(c echo.Context) error {
		return c.String(http.StatusOK, "should not reach here")
	})

	err := handler(c)
	require.NoError(t, err)
	assert.Equal(t, http.StatusBadRequest, rec.Code)

	errResp := parseErrorResponse(t, rec.Body)
	assert.Equal(t, http.StatusBadRequest, errResp.Code)
	assert.Equal(t, "session_id cookie is required", errResp.Message)
	require.NotNil(t, errResp.Field)
	assert.Equal(t, "sessionId", *errResp.Field)
	require.NotNil(t, errResp.Location)
	assert.Equal(t, api.Cookie, *errResp.Location)
}

func TestValidation_MultipleErrors_ReturnsFirst(t *testing.T) {
	e, rec := setupTest()

	mockVal := &mockValidator{
		isValid: false,
		validationErrors: []*verror.ValidationError{
			{
				ValidationType:    vhelpers.ParameterValidation,
				ValidationSubType: "query",
				ParameterName:     "param1",
				HowToFix:          "first error",
			},
			{
				ValidationType:    vhelpers.ParameterValidation,
				ValidationSubType: "query",
				ParameterName:     "param2",
				HowToFix:          "second error",
			},
		},
	}

	req := httptest.NewRequest(http.MethodGet, "/test", http.NoBody)
	c := createTestContext(e, req, rec)

	handler := middleware.Validation(mockVal)(func(c echo.Context) error {
		return c.String(http.StatusOK, "should not reach here")
	})

	err := handler(c)
	require.NoError(t, err)
	assert.Equal(t, http.StatusBadRequest, rec.Code)

	errResp := parseErrorResponse(t, rec.Body)
	assert.Equal(t, "first error", errResp.Message)
	require.NotNil(t, errResp.Field)
	assert.Equal(t, "param1", *errResp.Field)
}

func TestValidation_GenericValidationError(t *testing.T) {
	e, rec := setupTest()

	mockVal := &mockValidator{
		isValid: false,
		validationErrors: []*verror.ValidationError{
			{
				ValidationType: "unknown_type",
				ParameterName:  "some_field",
				HowToFix:       "generic validation error",
			},
		},
	}

	req := httptest.NewRequest(http.MethodGet, "/test", http.NoBody)
	c := createTestContext(e, req, rec)

	handler := middleware.Validation(mockVal)(func(c echo.Context) error {
		return c.String(http.StatusOK, "should not reach here")
	})

	err := handler(c)
	require.NoError(t, err)
	assert.Equal(t, http.StatusBadRequest, rec.Code)

	errResp := parseErrorResponse(t, rec.Body)
	assert.Equal(t, http.StatusBadRequest, errResp.Code)
	assert.Equal(t, "generic validation error", errResp.Message)
	require.NotNil(t, errResp.Field)
	assert.Equal(t, "someField", *errResp.Field)
}

func TestValidation_NoErrorsReturned(t *testing.T) {
	e, rec := setupTest()

	mockVal := &mockValidator{
		isValid:          false,
		validationErrors: nil, // No errors returned despite validation failure
	}

	req := httptest.NewRequest(http.MethodGet, "/test", http.NoBody)
	c := createTestContext(e, req, rec)

	handler := middleware.Validation(mockVal)(func(c echo.Context) error {
		return c.String(http.StatusOK, "should not reach here")
	})

	// This should return an error because validation failed but no errors were provided
	err := handler(c)
	require.Error(t, err)
	assert.ErrorIs(t, err, middleware.ErrNoErrorReturned)
}
