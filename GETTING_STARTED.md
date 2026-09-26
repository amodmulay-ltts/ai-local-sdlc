# Getting Started — M0 Foundation Ready

## What was just built (M0 — Repo & Tooling Bootstrap)

The foundational infrastructure for the AI-SDLC Factory is now in place:

### 📦 Project Structure
```
ai-local-sdlc/
├── src/                          # Main application code
│   ├── api/                      # FastAPI routes (M1+)
│   ├── core/                     # Config, DB, shared utilities
│   ├── ingestion/                # Document parsing (M3)
│   ├── orchestrator/             # Agent orchestration (M5)
│   └── playbooks/                # Playbook definitions (M6)
├── tests/                        # Test suite
├── alembic/                      # Database migrations
├── .github/workflows/            # CI/CD (GitHub Actions)
├── pyproject.toml               # Dependencies, pytest, ruff, mypy config
├── docker-compose.yml           # PostgreSQL + pgvector + Redis
├── Makefile                     # Common commands
└── README.md                    # Overview
```

### ✅ What's configured

1. **Python project structure** (`pyproject.toml`)
   - Core deps: FastAPI, SQLAlchemy, Pydantic, Anthropic SDK, LangGraph
   - Dev deps: pytest, ruff, mypy, black, isort, pre-commit
   - Tested against Python 3.10+

2. **Database** (PostgreSQL + pgvector via docker-compose)
   - SQLAlchemy ORM ready
   - Alembic migrations system configured
   - Vector search (pgvector) enabled

3. **Testing & Code Quality**
   - pytest + coverage
   - ruff (linter) + mypy (type checker) + black (formatter)
   - pre-commit hooks configured (optional)
   - CI workflow (GitHub Actions)

4. **Tooling**
   - FastAPI app skeleton (`src/api/main.py`)
   - Database config (`src/core/config.py`, `src/core/database.py`)
   - Pytest fixtures (`tests/conftest.py`)
   - Makefile shortcuts for common tasks

---

## Next: Install & Verify M0 (15 minutes)

### 1. Install dependencies
```bash
cd d:/dev/ai-local-sdlc

# Core + dev (recommended)
pip install -e ".[dev]"

# Or just core (if you only want to run, not develop)
pip install -e .
```

### 2. Verify pytest works
```bash
pytest tests/test_sanity.py -v
```

**Expected output:**
```
tests/test_sanity.py::test_true PASSED
tests/test_sanity.py::test_math PASSED
======================== 2 passed in 0.08s ========================
```

### 3. Verify linting & type-checking
```bash
ruff check src tests
black --check src tests  # or 'black src tests' to format
```

**Expected output:** All pass (or format fixes applied)

### 4. Verify database container works (requires Docker)
```bash
docker-compose up -d postgres redis
docker-compose ps
```

**Expected output:** Both services show `healthy` status

### 5. Verify Alembic migrations
```bash
# With the DB running:
alembic upgrade head
```

**Expected output:** "Context impl PostgresqlImpl" (0 migrations since none exist yet)

---

## What M0 gives you

- ✅ A working Python project structure (no more "where does this go?")
- ✅ Instant feedback on code quality (ruff runs on save if pre-commit installed)
- ✅ Safe database changes (Alembic migrations)
- ✅ CI that gates commits (GitHub Actions)
- ✅ A repeatable development environment (docker-compose)

## Ready for M1? Follow the checklist

Once the above steps pass, you're ready to start **M1 — Core data model**.

Open [DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md) and see rows **1.1 through 1.8**:

1. **1.1:** Create `Project` SQLAlchemy model + test
2. **1.2:** Alembic migration for `Project`
3. **1.3:** Pydantic schemas for `Project`
4. **1.4:** Repository functions (CRUD)
5. **1.5:** FastAPI routes
6. **1.6:** `ModelProfile` (same pattern)
7. **1.7:** `KnowledgeSource` (same pattern)
8. **1.8:** Milestone integration test

Each row is ~30–60 min of focused work. Test first, code second. Commit each row individually.

---

## Useful Makefile commands

```bash
make install-dev      # Install with dev deps
make test             # Run tests with coverage
make lint             # Lint with ruff
make format           # Format code with black
make type-check       # Type check with mypy
make db-up            # Start PostgreSQL + Redis
make db-down          # Stop containers
make migrate          # Run DB migrations
make dev              # Start API with auto-reload
```

Or just `make help` to see all options.

---

## Troubleshooting

### "pytest: command not found"
→ Run `pip install -e ".[dev]"` to install dev dependencies

### "DATABASE_URL not set"
→ Copy `.env.example` to `.env` and adjust if needed

### "docker: command not found"
→ Install Docker Desktop or Docker CE for your platform

### "alembic: command not found"
→ Included in `.[dev]` deps; reinstall or use `python -m alembic`

### CI fails in GitHub
→ The workflow sets `DATABASE_URL` automatically for the test container. Local tests need Docker running.

---

## Architecture refresh (links to key docs)

- **[PLAN.md](PLAN.md)** — Full system design, V-model alignment, risk mitigation
- **[DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md)** — Atomic build order (M0–M11)
- **[M0_COMPLETION.md](M0_COMPLETION.md)** — This milestone's details

---

## You're all set! 🚀

Next step: Move to **M1** in [DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md).

The structure is ready. Now we build the data model that everything else depends on.
