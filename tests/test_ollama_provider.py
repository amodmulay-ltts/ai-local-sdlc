"""Ollama adapter (DEVELOPMENT_PLAN row 2.3).

HTTP is mocked with respx at the transport boundary, so no daemon is needed.
"""

import httpx
import pytest
import respx

from src.llm.base import GenerateRequest
from src.llm.errors import LLMError
from src.llm.ollama import OllamaProvider
from tests.test_llm_contract import ProviderContract

BASE_URL = "http://ollama.test:11434"


@pytest.fixture
def ollama_mock():
    """Mock the two Ollama endpoints the adapter uses."""
    with respx.mock(base_url=BASE_URL, assert_all_called=False) as router:
        router.post("/api/generate").mock(
            return_value=httpx.Response(
                200,
                json={
                    "model": "test-model",
                    "response": "hello back",
                    "done": True,
                    "prompt_eval_count": 12,
                    "eval_count": 5,
                },
            )
        )
        router.post("/api/embed").mock(
            return_value=httpx.Response(
                200, json={"model": "test-embed", "embeddings": [[0.1, 0.2], [0.3, 0.4]]}
            )
        )
        yield router


class TestOllamaProviderContract(ProviderContract):
    """The Ollama adapter must pass the same contract as the fake."""

    def make_provider(self) -> OllamaProvider:
        return OllamaProvider(base_url=BASE_URL)

    @pytest.fixture(autouse=True)
    def _use_mock(self, ollama_mock):
        return ollama_mock


class TestOllamaProviderBehaviour:
    def test_generate_maps_ollama_usage_to_tokens(self, ollama_mock):
        resp = OllamaProvider(base_url=BASE_URL).generate(
            GenerateRequest(model_id="test-model", prompt="hi", temperature=0.2, max_tokens=64)
        )
        assert resp.text == "hello back"
        assert resp.input_tokens == 12
        assert resp.output_tokens == 5
        assert resp.total_tokens == 17
        assert resp.latency_ms is not None and resp.latency_ms >= 0

    def test_generate_sends_non_streaming_request_with_options(self, ollama_mock):
        OllamaProvider(base_url=BASE_URL).generate(
            GenerateRequest(
                model_id="test-model", prompt="hi", system="be brief", temperature=0.2, max_tokens=64
            )
        )
        sent = ollama_mock.calls.last.request
        import json

        body = json.loads(sent.content)
        assert body["model"] == "test-model"
        assert body["prompt"] == "hi"
        assert body["system"] == "be brief"
        assert body["stream"] is False
        assert body["options"] == {"temperature": 0.2, "num_predict": 64}

    def test_missing_usage_fields_become_none(self, ollama_mock):
        ollama_mock.post("/api/generate").mock(
            return_value=httpx.Response(200, json={"response": "x", "done": True})
        )
        resp = OllamaProvider(base_url=BASE_URL).generate(
            GenerateRequest(model_id="test-model", prompt="hi")
        )
        assert resp.input_tokens is None
        assert resp.output_tokens is None
        assert resp.total_tokens is None

    def test_unreachable_daemon_raises_actionable_error(self, ollama_mock):
        ollama_mock.post("/api/generate").mock(side_effect=httpx.ConnectError("refused"))
        with pytest.raises(LLMError, match="Ollama daemon unreachable at"):
            OllamaProvider(base_url=BASE_URL).generate(
                GenerateRequest(model_id="test-model", prompt="hi")
            )

    def test_http_error_raises_llm_error(self, ollama_mock):
        ollama_mock.post("/api/generate").mock(
            return_value=httpx.Response(404, json={"error": "model 'nope' not found"})
        )
        with pytest.raises(LLMError, match="HTTP 404"):
            OllamaProvider(base_url=BASE_URL).generate(
                GenerateRequest(model_id="nope", prompt="hi")
            )
