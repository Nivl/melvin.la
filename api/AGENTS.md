# AI AGENT INSTRUCTIONS

**PRIORITY**: If `./AGENTS.local.md` exists, its instructions takes over the one in this file.

**PROJECT**: Go backend API deployed to Fly.io at https://api.melvin.la
**WORKING DIRECTORY**: This current directory

## ARCHITECTURE

**Framework**: Latest version of Go with labstack/echo
**Language**: Go
**Specs**: OpenAPI 3.0 located at `./internal/gen/openapi.yml`
**Package Manager**: Go Modules
**Task Runner**: [Taskfile](https://taskfile.dev/docs/guide)

### Key Dependencies
- `github.com/labstack/echo/v4`: HTTP server framework
- `github.com/oapi-codegen/oapi-codegen`: OpenAPI code generation
- `go.uber.org/zap`: Structured logging library

## FILE STRUCTURE

```
api/
├── cmd/
│   └── api/
│       └── main.go          # Application entrypoint
├── internal/
│   ├── gen/                 # Generated code (DO NOT EDIT MANUALLY)
│   │   ├── api/             # API interfaces from OpenAPI spec
│   │   ├── sql/             # SQL queries and models (if using sqlc)
│   │   └── openapi.yml      # Final compiled OpenAPI specification
│   ├── lib/                 # Shared libraries and utilities
│   └── server/              # API endpoint implementations
├── openapi/                 # OpenAPI specification sources
│   ├── conf/                # oapi-codegen configuration files
│   ├── specs/               # Source OpenAPI specification files
│   └── templates/           # Custom oapi-codegen templates
├── Taskfile.yml             # Local development tasks
├── Taskfile_CI.yml          # CI/CD environment tasks
├── .env.development         # Development environment variables (committed)
├── .env.local               # Local overrides (gitignored)
├── go.mod                   # Go module definition
├── go.sum                   # Go module checksums
├── Dockerfile               # Container build instructions
└── fly.toml                 # Fly.io deployment configuration
```

## CODE CONVENTIONS

- **CRITICAL**: Never edit files in `internal/gen/` directory - they are auto-generated
- Use Go standard naming conventions (PascalCase for exported, camelCase for unexported)
- All exported functions and types must have comments
- Follow standard Go project layout patterns

## OPENAPI SPECIFICATION WORKFLOW

**Source Files**: Edit specifications in [`./openapi/specs/`](openapi/specs/)
**Generation Command**: `task generate`

**Required Steps After OpenAPI Changes**:
1. Edit source specs in `openapi/specs/`
2. Run `task generate`
3. Run `task tidy`
4. Update client code (see [`../web/AGENTS.md`](../web/AGENTS.md))

## ENDPOINT DEVELOPMENT STANDARDS

### File Organization
- **Location**: [`internal/server/`](internal/server/)
- **Naming**: snake_case for files and directories
- **Structure**: One file per endpoint or logical group

### Required Files for New Endpoints
1. **Implementation**: `endpoint_name.go` 
2. **Tests**: `endpoint_name_test.go`
3. **OpenAPI Spec**: Update relevant spec in [`openapi/specs/`](openapi/specs/)

### Endpoint Implementation Pattern
```go
// Example endpoint structure
func (s *Server) GetEndpointName(ctx echo.Context, params GetEndpointNameParams) error {
    // 1. Validate input parameters
    // 2. Business logic implementation  
    // 3. Return structured response
    return ctx.JSON(http.StatusOK, response)
}
```

## ENVIRONMENT CONFIGURATION

### Development Environment (`.env.development`)
```bash
API_EXTRA_CORS_ORIGINS=http://localhost:3000
API_PORT=80
API_FORTNITE_API_KEY=
```

### Local Overrides (`.env.local` - gitignored)
Add sensitive or personal configuration here. This file overrides `.env.development`.

## AVAILABLE COMMANDS

```bash
# Dependencies and Setup
task install-deps    # Install required development dependencies
task deps-upgrade    # Upgrade all Go dependencies

# Development Workflow  
task generate       # Generate code from OpenAPI specs
task build          # Build the API server binary
task dev            # Build and run in development mode with hot reload
task start          # Start pre-built API server

# Code Quality
task lint           # Run linter (golangci-lint)
task test           # Run all tests with coverage
task tidy           # Clean up generated files and Go modules
```

## QUALITY GATES

### Pre-Commit Requirements
**All commands must pass**:
1. `task tidy` 
2. `task lint`
3. `task test`

### Code Quality Checklist
- [ ] Input validation for all parameters
- [ ] Comprehensive unit tests (`*_test.go`)
- [ ] Error handling with appropriate HTTP status codes
- [ ] Logging for debugging and monitoring
- [ ] OpenAPI specification updated
- [ ] Documentation comments on exported functions

## DEVELOPMENT WORKFLOW

1. **Feature Development**:
   - Create/update OpenAPI specs in [`openapi/specs/`](openapi/specs/)
   - Run `task generate` to create interfaces
   - Implement endpoints in [`internal/server/`](internal/server/)
   - Write comprehensive tests

2. **Testing**:
   - Unit tests for all business logic
   - Integration tests for API endpoints
   - Validate against OpenAPI specification

3. **Quality Assurance**:
   - Run all quality gates before committing
   - Ensure proper error handling and status codes
   - Verify CORS configuration for frontend integration

## COMMIT STANDARDS

**Format**: Conventional Commits (https://conventionalcommits.org/)
**Scopes**: Feature name, then optionally project name
**Examples**:
```
feat(auth): add login endpoint
fix(fortnite,api): resolve API connection issues
```

**Allowed Types**: See [`../.github/semantic.yml`](../.github/semantic.yml)
**Scopes**: Feature area, component name, or endpoint group

## ERROR HANDLING

- Use appropriate HTTP status codes
- Return consistent error response format
- Log errors with sufficient context for debugging
- Handle edge cases and validation failures gracefully

## TESTING STRATEGY

- **Unit Tests**: Test individual functions and methods
- **Integration Tests**: Test complete request/response cycles
- **OpenAPI Validation**: Ensure responses match specification
- **Error Scenarios**: Test failure modes and edge cases
