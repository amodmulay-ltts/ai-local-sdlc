# Development Workflow — Test-First, Atomic Commits

This document describes the workflow you'll follow as you move through the build milestones.

## The Golden Rule

**Every milestone row = one atomic, testable unit. Test green before commit, commit before moving to the next row.**

## Workflow for each row (e.g., M1.1, M1.2, etc.)

### 1. Read the row's deliverable and test requirement

From [DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md), pick a row that's marked "to do":

```
| 1.1 | `Project` SQLAlchemy model ... | Create/read round-trip against test DB |
```

The deliverable = what to build. The test = how you'll know it's done.

### 2. Write the test FIRST

Open `tests/test_models.py` (or create it if it doesn't exist). Write a test that *fails* right now:

```python
def test_project_create_and_read(db_session):
    """Test creating and reading a Project."""
    project = Project(name="Test Project", knowledge_scope_policy="project-private")
    db_session.add(project)
    db_session.commit()
    
    # Read it back
    retrieved = db_session.query(Project).filter_by(name="Test Project").first()
    assert retrieved is not None
    assert retrieved.name == "Test Project"
    assert retrieved.knowledge_scope_policy == "project-private"
```

Run it:
```bash
pytest tests/test_models.py::test_project_create_and_read -v
```

**Expected:** Test fails with `ImportError: cannot import name 'Project'` or similar.

### 3. Implement the minimum to make the test pass

Create the model in `src/core/models.py`:

```python
from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from src.core.database import Base

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    knowledge_scope_policy = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

Run the test again:
```bash
pytest tests/test_models.py::test_project_create_and_read -v
```

**Expected:** Test passes.

### 4. Verify it's covered (check coverage if available)

```bash
pytest tests/test_models.py --cov=src.core --cov-report=term-missing
```

Aim for >90% on new code, but don't obsess over 100%.

### 5. Lint & type-check

```bash
ruff check src tests
mypy src --ignore-missing-imports
black --check src tests
```

Fix any issues. If `ruff check --fix` can auto-fix, it will.

### 6. Commit atomically

```bash
git add src/core/models.py tests/test_models.py
git commit -m "M1.1: Add Project model with create/read test

- Project table with name, knowledge_scope_policy, timestamps
- Test validates round-trip create/read against test DB

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

### 7. Move to the next row

✅ Row 1.1 done. Pick up 1.2 and repeat.

---

## Special case: Database migrations

When you add a new model, you also need a migration (per the plan).

### Create migration

After the model test passes:

```bash
alembic revision --autogenerate -m "Add Project table"
```

This creates `alembic/versions/001_add_project_table.py` with the detected schema.

**Verify the migration:**
```bash
cat alembic/versions/001_add_project_table.py
```

Make sure it looks right. If not, delete it and fix the model, then regenerate.

### Test the migration

```bash
# Start the DB
docker-compose up -d postgres

# Run migrations
alembic upgrade head

# Connect and check
psql -U sdlc_user -d ai_sdlc_db -c "\\d projects"
```

Expected: The `projects` table exists with the right columns.

### Commit it

```bash
git add alembic/versions/001_add_project_table.py
git commit -m "M1.2: Migration for Project table

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Integration tests (milestone gates)

At the end of each milestone (M1, M2, etc.), there's a row marked **"Milestone integration test"**.

This test exercises everything built in that milestone **end-to-end via the public API**.

**Example (M1.8):**

```python
def test_m1_end_to_end(test_client, db_session):
    """M1 integration: CRUD the data model via FastAPI."""
    
    # Create a project via API
    response = test_client.post(
        "/projects",
        json={"name": "Integration Test", "knowledge_scope_policy": "project-private"}
    )
    assert response.status_code == 201
    project_id = response.json()["id"]
    
    # Fetch it
    response = test_client.get(f"/projects/{project_id}")
    assert response.status_code == 200
    assert response.json()["name"] == "Integration Test"
    
    # List projects
    response = test_client.get("/projects")
    assert response.status_code == 200
    assert len(response.json()) >= 1
```

**Run it:**
```bash
pytest tests/test_integration.py::test_m1_end_to_end -v
```

**Milestone gate = green integration test. Don't move to the next milestone until it passes.**

---

## Common patterns

### Testing with fixtures

```python
@pytest.fixture
def sample_project(db_session):
    """A reusable project fixture."""
    project = Project(name="Test", knowledge_scope_policy="project-private")
    db_session.add(project)
    db_session.commit()
    return project

def test_something(sample_project):
    assert sample_project.name == "Test"
```

### Mocking HTTP calls (for adapters)

```python
import respx
import httpx

@respx.mock
def test_ollama_adapter():
    """Test without calling the real Ollama."""
    route = respx.post("http://localhost:11434/api/generate").mock(
        return_value=httpx.Response(200, json={"response": "Hello"})
    )
    
    adapter = OllamaAdapter()
    result = adapter.generate("test prompt")
    
    assert result.text == "Hello"
    assert route.called
```

---

## Debugging a failing test

1. **Run with verbose output:**
   ```bash
   pytest tests/test_foo.py::test_bar -vv -s
   ```
   `-s` shows print statements; `-vv` is extra verbose.

2. **Use PDB:**
   ```python
   import pdb; pdb.set_trace()
   ```
   in your test, then run pytest without `-x` (it will drop you into the debugger).

3. **Check the database state:**
   ```bash
   psql -U sdlc_user -d ai_sdlc_db -c "SELECT * FROM projects LIMIT 5;"
   ```

---

## Why this workflow?

- **Test first:** clarifies what you're building before you build it.
- **Atomic commits:** easy to review, easy to revert if something breaks.
- **Integration gates:** catch integration issues early (e.g., serialization, API contract).
- **Milestones:** you know exactly where you are in the roadmap.

---

## Checklist before closing a milestone

- ✅ All unit tests green
- ✅ All linting/type checks pass
- ✅ Integration test green
- ✅ Commits are atomic and have good messages
- ✅ Code review (if applicable)
- ✅ Documentation updated (if user-facing)

Then move to the next milestone.

---

## Questions?

Refer to [DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md) for the full breakdown of what each milestone should deliver.

Refer to [PLAN.md](PLAN.md) for *why* the architecture is the way it is.
