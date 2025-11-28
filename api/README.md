# Melvin.la API

Go backend API for [melvin.la](https://melvin.la) - provides data services for various tools and games.

## Tech Stack

- **Language**: Go
- **Framework**: Echo v4 (HTTP server)
- **API Spec**: OpenAPI 3.0 with code generation
- **Logging**: Zap structured logging
- **Deployment**: Fly.io

## Getting Started

### Prerequisites
- Latest version of Go
- [Task](https://taskfile.dev/installation/) (task runner)

### Installation & Development

```bash
# Install dependencies
task install-deps

# Generate code from OpenAPI specs
task generate

# Start development server
task dev

# API will be available at http://localhost:5000
```

### Available Commands

```bash
# Development
task dev            # Start with hot reload
task build          # Build binary
task start          # Start pre-built server

# Code Quality
task generate       # Generate code from OpenAPI specs
task lint           # Run linter
task test           # Run tests with coverage
task tidy           # Clean up modules and generated files
```

## Environment Configuration

### Development (`.env.development`)
```bash
API_PORT=5000
API_EXTRA_CORS_ORIGINS=http://localhost:3000
API_FORTNITE_API_KEY=your_api_key_here
```

### Local Overrides (`.env.local` - gitignored)
Add your personal/sensitive configuration here.

## Architecture

The API uses **code generation** for type safety and consistency:

1. **OpenAPI Specs** → Located in [`openapi/specs/`](openapi/specs/)
2. **Code Generation** → Run `task generate` to create Go interfaces
3. **Implementation** → Endpoint logic in [`internal/server/`](internal/server/)

**Important**: Never edit files in [`internal/gen/`](internal/gen/) - they are auto-generated.

## Development Workflow

1. Update OpenAPI specification in [`openapi/specs/`](openapi/specs/)
2. Run `task generate` to update Go interfaces
3. Implement endpoint logic in [`internal/server/`](internal/server/)
4. Write tests and run quality checks
5. Update frontend types (see [`../web/README.md`](../web/README.md))

## Quality Gates

Before committing, ensure all commands pass:
```bash
task tidy && task lint && task test
```

## Deployment

The API is deployed to [api.melvin.la](https://api.melvin.la) using Fly.io. The `main` branch auto-deploys to production.

For detailed development guidelines, see [`./AGENTS.md`](./AGENTS.md).
