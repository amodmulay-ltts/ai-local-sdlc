"""Provider-neutral LLM interface (DEVELOPMENT_PLAN row 2.1).

Orchestrator and playbooks depend only on ``LLMProvider``. Each backend is an
adapter behind it, so a provider can change without touching playbook definitions.
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass(frozen=True)
class GenerateRequest:
    """One generation call."""

    model_id: str
    prompt: str
    system: str | None = None
    temperature: float = 0.7
    max_tokens: int | None = None


@dataclass(frozen=True)
class GenerateResponse:
    """Result of one generation call. Token fields are None when the provider does not report them."""

    text: str
    model_id: str
    input_tokens: int | None
    output_tokens: int | None
    latency_ms: int | None

    @property
    def total_tokens(self) -> int | None:
        """Sum of input and output tokens, or None if either is unknown."""
        if self.input_tokens is None or self.output_tokens is None:
            return None
        return self.input_tokens + self.output_tokens


class LLMProvider(ABC):
    """Interface every model backend implements."""

    name: str

    @abstractmethod
    def generate(self, request: GenerateRequest) -> GenerateResponse:
        """Run one completion and return text plus usage."""

    @abstractmethod
    def embed(self, model_id: str, texts: list[str]) -> list[list[float]]:
        """Return one embedding vector per input text, in order."""
