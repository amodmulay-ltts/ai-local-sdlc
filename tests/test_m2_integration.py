"""M2 milestone integration test (DEVELOPMENT_PLAN row 2.7).

Resolve a ModelProfile for a project, make a generate() call against a mocked
Ollama daemon, and check the CallLog row. Also check that a local-only project
blocks a cloud profile before any network call is made.
"""

import httpx
import pytest
import respx

from src.core.models import CallLog, ModelProfile, Project
from src.llm.accounting import generate_and_log
from src.llm.base import GenerateRequest
from src.llm.errors import LocalOnlyPolicyError
from src.llm.resolver import resolve_provider

DAEMON = "http://m2-daemon.test:11434"


@pytest.fixture
def ollama():
    with respx.mock(base_url=DAEMON, assert_all_called=False) as router:
        router.post("/api/generate").mock(
            return_value=httpx.Response(
                200,
                json={"response": "The ACC shall hold a set gap.", "prompt_eval_count": 40, "eval_count": 9},
            )
        )
        yield router


def _seed(session, *, policy: str):
    project = Project(name="ACC program", model_policy=policy)
    local = ModelProfile(
        name="local-fast",
        provider="ollama",
        model_id="qwen2.5:3b",
        temperature="0.2",
        cost_class="free",
        is_local=True,
    )
    cloud = ModelProfile(
        name="cloud-strong",
        provider="anthropic",
        model_id="claude-example",
        api_key_ref="ANTHROPIC_KEY",
        cost_class="expensive",
        is_local=False,
    )
    session.add_all([project, local, cloud])
    session.flush()
    return project, local, cloud


def test_local_profile_generates_and_logs_on_local_only_project(db_session, ollama):
    project, local, _ = _seed(db_session, policy="local-only")

    provider = resolve_provider(local, project, ollama_base_url=DAEMON)
    request = GenerateRequest(model_id=local.model_id, prompt="Draft requirement REQ-1", temperature=0.2)
    resp = generate_and_log(
        provider,
        request,
        db_session,
        cost_class=local.cost_class,
        step_name="draft",
    )

    assert resp.text == "The ACC shall hold a set gap."
    row = db_session.query(CallLog).one()
    assert row.provider == "ollama"
    assert row.model_id == "qwen2.5:3b"
    assert row.total_tokens == 49
    assert row.estimated_cost == "free"
    assert row.step_name == "draft"


def test_cloud_profile_blocked_on_local_only_project_before_any_call(db_session, ollama):
    project, _, cloud = _seed(db_session, policy="local-only")

    with pytest.raises(LocalOnlyPolicyError):
        resolve_provider(cloud, project, ollama_base_url=DAEMON)

    assert ollama.calls.call_count == 0
    assert db_session.query(CallLog).count() == 0
