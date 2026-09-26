# AI-SDLC Factory

An AI-powered Software Development Lifecycle system that turns raw project material (PDFs, docs, spreadsheets, git repos) into governed knowledge bases, generates requirements specifications, and validates them with independent LLM judges.

**Repository:** https://github.com/amodmulay-ltts/ai-local-sdlc.git

See [PLAN.md](PLAN.md) for the full architecture and vision.
See [DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md) for the atomic build order.

## Quick Start

### Prerequisites

- Python 3.10+
- Docker & Docker Compose (for PostgreSQL)
- pip or uv

### Setup

1. **Clone and install:**
   ```bash
   cd ai-local-sdlc
   pip install -e ".[dev]"
   ```

2. **Install pre-commit hooks (optional but recommended):**
   ```bash
   make pre-commit-install
   ```

3. **Start the database:**
   ```bash
   make db-up
   ```

4. **Run migrations:**
   ```bash
   make migrate
   ```

5. **Run tests to verify setup:**
   ```bash
   make test
   ```

6. **Start the API server:**
   ```bash
   make dev
   ```

The API will be available at `http://localhost:8000` with OpenAPI docs at `/docs`.

## Development Workflow

### Running Tests
```bash
# All tests with coverage
make test

# Integration tests only
make test-integration

# Watch mode (requires pytest-watch)
ptw
```

### Code Quality
```bash
# Lint
make lint

# Format code
make format

# Type check
make type-check

# All checks together
make lint && make type-check
```

### Database Migrations
```bash
# Create a new migration (auto-detected changes)
make migrate-create

# Apply migrations
make migrate

# Downgrade one migration
make migrate-downgrade
```

### API Development
```bash
# Development mode with auto-reload
make dev

# Production mode
make run
```

## Project Structure

```
├── src/
│   ├── api/           # FastAPI application
│   ├── core/          # Configuration, database, shared utilities
│   ├── ingestion/     # Document parsing and chunking
│   ├── orchestrator/  # Agent orchestration and execution
│   └── playbooks/     # Playbook definitions and execution
├── tests/             # Test suite
├── alembic/           # Database migrations
├── PLAN.md            # Architecture and vision document
├── DEVELOPMENT_PLAN.md # Atomic build order
└── pyproject.toml     # Python project configuration
```

## Build Milestones

See [DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md) for the detailed breakdown:

- **M0** — Repo & tooling bootstrap ✓ (in progress)
- **M1** — Core data model: Project, ModelProfile, KnowledgeSource
- **M2** — Model router / LLM adapter layer + Local Model Manager
- **M3** — Ingestion pipeline (PDF, DOCX, XLSX, Git)
- **M4** — Embedding & retrieval
- **M5** — Orchestrator & agent framework
- **M6** — Playbook engine
- **M7** — Requirements-generation agents
- **M8** — Judge agent & refinement loop
- **M9** — Traceability & portability export
- **M10** — Auth, RBAC, cross-project governance
- **M11** — Frontend (TypeScript/Next.js)

## Technology Stack

- **API:** FastAPI, Uvicorn
- **Database:** PostgreSQL + pgvector
- **Orchestration:** LangGraph
- **LLMs:** Anthropic (Claude API), Ollama (local), OpenAI/Azure (future)
- **Testing:** pytest, respx (HTTP mocking)
- **Code Quality:** ruff, mypy, black

## License

Apache 2.0

## Contributing

See the build milestones in [DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md). Each row is an atomic, independently-tested unit. Nothing moves to the next step until the current step's tests are green.
