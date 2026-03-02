# AI AGENT INSTRUCTIONS

**PRIORITY**: If `./AGENTS.local.md` exists, its instructions takes over the one in this file.

## ⚠️ MANDATORY: TASK COMPLETION CHECKLIST

**Every task is incomplete until all of the following pass from `api/`**:

```bash
task tidy    # must pass
task lint    # must pass
task test    # must pass
```

> Do NOT consider a task done until these all pass.

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

## COMMIT STANDARDS

**Format**: Conventional Commits (https://conventionalcommits.org/)
**Scopes**: Feature name, then optionally project name
**Examples**:
```
feat(auth): add login endpoint
fix(fortnite,api): resolve API connection issues
```

**Allowed Types**: See [`../.github/semantic.yml`](../.github/semantic.yml)
