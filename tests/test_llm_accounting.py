"""Token and cost accounting around every adapter call (DEVELOPMENT_PLAN row 2.6)."""

import pytest

from src.core.models import CallLog
from src.llm.accounting import generate_and_log
from src.llm.base import GenerateRequest
from tests.fakes import FakeProvider


def test_successful_call_writes_call_log_with_token_counts(db_session):
    provider = FakeProvider(input_tokens=12, output_tokens=5)
    request = GenerateRequest(model_id="qwen2.5:3b", prompt="hi")

    resp = generate_and_log(
        provider,
        request,
        db_session,
        cost_class="free",
        playbook_run_id=7,
        step_name="retrieve",
    )

    assert resp.text == "echo: hi"
    row = db_session.query(CallLog).one()
    assert row.provider == "fake"
    assert row.model_id == "qwen2.5:3b"
    assert row.input_tokens == 12
    assert row.output_tokens == 5
    assert row.total_tokens == 17
    assert row.estimated_cost == "free"
    assert row.playbook_run_id == 7
    assert row.step_name == "retrieve"
    assert row.latency_ms == 1


def test_unknown_usage_is_recorded_as_null_not_zero(db_session):
    provider = FakeProvider(input_tokens=None, output_tokens=None)
    generate_and_log(provider, GenerateRequest(model_id="m", prompt="hi"), db_session)

    row = db_session.query(CallLog).one()
    assert row.input_tokens is None
    assert row.output_tokens is None
    assert row.total_tokens is None


def test_failed_call_writes_no_call_log_row(db_session):
    class BrokenProvider(FakeProvider):
        def generate(self, request):
            raise RuntimeError("daemon down")

    with pytest.raises(RuntimeError, match="daemon down"):
        generate_and_log(BrokenProvider(), GenerateRequest(model_id="m", prompt="hi"), db_session)

    assert db_session.query(CallLog).count() == 0
