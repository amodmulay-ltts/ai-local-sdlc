"""Test doubles for the LLM layer (no network, deterministic output)."""

from src.llm.base import GenerateRequest, GenerateResponse, LLMProvider


class FakeProvider(LLMProvider):
    """In-memory provider that echoes the prompt and returns fixed token counts."""

    name = "fake"

    def __init__(self, input_tokens: int = 10, output_tokens: int = 4):
        self.input_tokens = input_tokens
        self.output_tokens = output_tokens
        self.calls: list[GenerateRequest] = []

    def generate(self, request: GenerateRequest) -> GenerateResponse:
        self.calls.append(request)
        return GenerateResponse(
            text=f"echo: {request.prompt}",
            model_id=request.model_id,
            input_tokens=self.input_tokens,
            output_tokens=self.output_tokens,
            latency_ms=1,
        )

    def embed(self, model_id: str, texts: list[str]) -> list[list[float]]:
        return [[float(len(text)), 1.0] for text in texts]
