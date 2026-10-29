"""Shared contract every LLMProvider adapter must pass (DEVELOPMENT_PLAN row 2.1).

Subclasses implement ``make_provider()``. Adapters that call HTTP must mock the
transport in their own subclass fixture, so the default suite never hits the network.
"""

from src.llm.base import GenerateRequest, GenerateResponse, LLMProvider
from tests.fakes import FakeProvider


class ProviderContract:
    """Mixin: every adapter test class inherits these checks."""

    model_id = "test-model"
    embed_model_id = "test-embed"

    def make_provider(self) -> LLMProvider:
        raise NotImplementedError

    def test_generate_returns_typed_response(self):
        resp = self.make_provider().generate(
            GenerateRequest(model_id=self.model_id, prompt="hello")
        )
        assert isinstance(resp, GenerateResponse)
        assert isinstance(resp.text, str)
        assert resp.model_id == self.model_id

    def test_generate_token_fields_are_int_or_none(self):
        resp = self.make_provider().generate(
            GenerateRequest(model_id=self.model_id, prompt="hello")
        )
        for value in (resp.input_tokens, resp.output_tokens):
            assert value is None or isinstance(value, int)

    def test_embed_returns_one_vector_per_text(self):
        vectors = self.make_provider().embed(self.embed_model_id, ["a", "bb"])
        assert len(vectors) == 2
        assert all(isinstance(v, list) and len(v) > 0 for v in vectors)


class TestFakeProviderContract(ProviderContract):
    """The reference fake must satisfy the contract before any real adapter is tested."""

    def make_provider(self) -> LLMProvider:
        return FakeProvider()
