"""Ollama adapter for a local, already-running daemon (DEVELOPMENT_PLAN row 2.3).

Talks to the Ollama HTTP API. Model download and lifecycle are a separate concern
(rows 2.8–2.15) and are not handled here.
"""

import time

import httpx

from src.llm.base import GenerateRequest, GenerateResponse, LLMProvider
from src.llm.errors import LLMError


class OllamaProvider(LLMProvider):
    """Adapter for an Ollama daemon reachable at ``base_url``."""

    name = "ollama"

    def __init__(
        self,
        base_url: str,
        client: httpx.Client | None = None,
        timeout: float = 120.0,
    ):
        self.base_url = base_url
        self._client = client or httpx.Client(base_url=base_url, timeout=timeout)

    def generate(self, request: GenerateRequest) -> GenerateResponse:
        options: dict = {"temperature": request.temperature}
        if request.max_tokens is not None:
            options["num_predict"] = request.max_tokens

        body: dict = {
            "model": request.model_id,
            "prompt": request.prompt,
            "stream": False,
            "options": options,
        }
        if request.system:
            body["system"] = request.system

        started = time.perf_counter()
        data = self._post("/api/generate", body)
        latency_ms = int((time.perf_counter() - started) * 1000)

        return GenerateResponse(
            text=data.get("response", ""),
            model_id=request.model_id,
            input_tokens=data.get("prompt_eval_count"),
            output_tokens=data.get("eval_count"),
            latency_ms=latency_ms,
        )

    def embed(self, model_id: str, texts: list[str]) -> list[list[float]]:
        data = self._post("/api/embed", {"model": model_id, "input": list(texts)})
        embeddings = data.get("embeddings")
        if not isinstance(embeddings, list) or len(embeddings) != len(texts):
            raise LLMError(
                f"Ollama returned {len(embeddings) if isinstance(embeddings, list) else 'no'} "
                f"embeddings for {len(texts)} inputs"
            )
        return embeddings

    def _post(self, path: str, body: dict) -> dict:
        """POST to the daemon and return the decoded JSON, converting every failure to LLMError."""
        try:
            response = self._client.post(path, json=body)
        except httpx.TransportError as exc:
            raise LLMError(
                f"Ollama daemon unreachable at {self.base_url}: {exc}. "
                "Start the local runtime and try again."
            ) from exc

        if response.status_code >= 400:
            detail = response.text[:300]
            raise LLMError(f"Ollama returned HTTP {response.status_code} for {path}: {detail}")

        try:
            return response.json()
        except ValueError as exc:
            raise LLMError(f"Ollama returned a non-JSON response for {path}") from exc
