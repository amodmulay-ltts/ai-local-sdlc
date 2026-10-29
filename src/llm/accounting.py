"""Record every successful model call in ``CallLog`` (DEVELOPMENT_PLAN row 2.6).

Only successful calls are written. ``CallLog`` has no status column yet, so
failures are raised to the caller and not recorded here.
"""

from sqlalchemy.orm import Session

from src.core.models import CallLog
from src.llm.base import GenerateRequest, GenerateResponse, LLMProvider


def generate_and_log(
    provider: LLMProvider,
    request: GenerateRequest,
    session: Session,
    *,
    cost_class: str | None = None,
    playbook_run_id: int | None = None,
    step_name: str | None = None,
) -> GenerateResponse:
    """Run one generation and add a ``CallLog`` row for it to ``session``.

    The row is flushed, not committed, so the caller controls the transaction.
    """
    response = provider.generate(request)

    session.add(
        CallLog(
            provider=provider.name,
            model_id=response.model_id,
            input_tokens=response.input_tokens,
            output_tokens=response.output_tokens,
            total_tokens=response.total_tokens,
            estimated_cost=cost_class,
            latency_ms=response.latency_ms,
            playbook_run_id=playbook_run_id,
            step_name=step_name,
        )
    )
    session.flush()
    return response
