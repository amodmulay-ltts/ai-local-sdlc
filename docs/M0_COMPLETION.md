# M0 Completion — Repo & Tooling Bootstrap ✓

Status: **IN PROGRESS** (ready for M0.4 verification)

## What's been completed (M0.1 – M0.3)

### ✓ M0.1: Repo skeleton
```
├── api/
├── ingestion/
├── orchestrator/
├── playbooks/
├── web/
├── tests/
├── src/
│   ├── __init__.py
│   ├── api/
│   │   ├── __init__.py
│   │   └── main.py (basic FastAPI app)
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py (pydantic settings)
│   │   └── database.py (SQLAlchemy setup)
│   ├── ingestion/
│   ├── orchestrator/
│   └── playbooks/
└── tests/
    ├── __init__.py
    ├── conftest.py (pytest fixtures)
    └── test_sanity.py (sanity checks)
```

### ✓ M0.2: pyproject.toml
- `uv` or `pip` installable
- All core + dev dependencies pinned
- pytest, ruff, mypy, black, isort configured
- Coverage thresholds set up

### ✓ M0.3: Linting & type-checking
- `pytest` + `pytest-cov` configured
- `ruff` + `mypy` + `black` + `isort` configured
- `.pre-commit-config.yaml` created
- `.ruff.toml` rules in `pyproject.toml`
- Sanity test: `tests/test_sanity.py` exists

### ✓ M0.4: Docker setup
- `docker-compose.yml` with PostgreSQL + pgvector + Redis
- Health checks for both services
- Network isolation

### ✓ M0.5: Alembic setup
- `alembic/` directory with `env.py`, `script.py.mako`
- `alembic.ini` configured
- Migration placeholder structure ready
- Database config wired from `.env`

### ✓ M0.6: CI workflow
- `.github/workflows/ci.yml` created
- Runs on push/PR to main/develop
- Tests against Python 3.10, 3.11, 3.12
- Codecov integration
- Lint/format checks

### ✓ M0.x: Additional setup
- `.env.example` for configuration
- `.gitignore` properly configured
- `Makefile` for common commands
- `README.md` with quick-start guide
- Basic FastAPI app in `src/api/main.py`

---

## How to verify M0 is complete

1. **Install dependencies (without docker):**
   ```bash
   pip install -e .
   # or with dev deps:
   pip install -e ".[dev]"
   ```

2. **Run the sanity test:**
   ```bash
   pytest tests/test_sanity.py -v
   ```
   
   **Expected output:** 2 passed

3. **Run lint/format checks:**
   ```bash
   ruff check .
   black --check src tests
   ```
   
   **Expected output:** All pass

4. **Verify database setup (requires docker-compose):**
   ```bash
   docker-compose up -d
   # Wait for health checks to pass
   docker-compose ps
   ```
   
   **Expected output:** postgres and redis both `healthy`

5. **Test migration system (requires docker and Python deps):**
   ```bash
   alembic upgrade head
   ```
   
   **Expected output:** "INFO  [alembic.runtime.migration] Context impl PostgresqlImpl."
   
   (It will say 0 revisions applied since we haven't created any yet.)

6. **Quick API smoke test (requires docker and Python deps):**
   ```bash
   python -m uvicorn src.api.main:app --port 8000
   # In another terminal:
   curl http://localhost:8000/health
   # Expected: {"status":"ok"}
   ```

---

## Next step: M1 — Core data model

Once M0 is green (all checks above pass), proceed to [DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md) **M1**:

1. Create `Project` SQLAlchemy model
2. Create `ModelProfile` and `KnowledgeSource` models
3. Write unit tests for each
4. Create Pydantic schemas
5. Create database migration
6. Create FastAPI CRUD routes

See [DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md) rows 1.1–1.8 for the atomic breakdown.

---

## Known issues / TODOs

- **Async database sessions:** The current `get_db()` is sync. In M1, will migrate to async SQLAlchemy where appropriate.
- **Settings validation:** `.env.example` is a template; tests should use a test-specific `.env.test`.
- **Pre-commit hooks:** Not yet installed locally (optional but recommended with `make pre-commit-install`).

---

## Commit history

All work in M0 should be a single commit (or one per major section):
```
M0: Repo bootstrap, tooling, Alembic, CI

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
```
