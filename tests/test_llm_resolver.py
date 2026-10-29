"""ModelProfile -> adapter resolver and local-only policy (DEVELOPMENT_PLAN rows 2.4, 2.5)."""

import pytest

from src.core.models import ModelProfile, Project
from src.llm.errors import LocalOnlyPolicyError, UnsupportedProviderError
from src.llm.ollama import OllamaProvider
from src.llm.resolver import resolve_provider

DAEMON = "http://daemon.test:11434"


def _profile(**overrides) -> ModelProfile:
    fields = {
        "name": "p",
        "provider": "ollama",
        "model_id": "qwen2.5:3b",
        "endpoint": None,
        "api_key_ref": None,
        "temperature": "0.2",
        "cost_class": "free",
        "is_local": True,
    }
    fields.update(overrides)
    return ModelProfile(**fields)


def _project(policy: str) -> Project:
    return Project(name="proj", model_policy=policy)


class TestResolveProvider:
    def test_ollama_profile_resolves_to_configured_adapter(self):
        provider = resolve_provider(_profile(), _project("local-only"), ollama_base_url=DAEMON)
        assert isinstance(provider, OllamaProvider)
        assert provider.base_url == DAEMON

    def test_profile_endpoint_overrides_default_daemon_url(self):
        profile = _profile(endpoint="http://gpu-box:11434")
        provider = resolve_provider(profile, _project("cloud-ok"), ollama_base_url=DAEMON)
        assert provider.base_url == "http://gpu-box:11434"

    def test_unknown_provider_raises_typed_error_not_key_error(self):
        profile = _profile(provider="lm_studio", is_local=True)
        with pytest.raises(UnsupportedProviderError, match="lm_studio"):
            resolve_provider(profile, _project("local-only"), ollama_base_url=DAEMON)

    def test_cloud_profile_without_adapter_raises_typed_error(self):
        # Claude adapter (row 2.2) is deferred; the resolver must say so clearly.
        profile = _profile(provider="anthropic", is_local=False, api_key_ref="ANTHROPIC_KEY")
        with pytest.raises(UnsupportedProviderError, match="anthropic"):
            resolve_provider(profile, _project("cloud-ok"), ollama_base_url=DAEMON)


class TestLocalOnlyPolicy:
    def test_cloud_profile_blocked_on_local_only_project(self):
        profile = _profile(provider="anthropic", is_local=False, api_key_ref="ANTHROPIC_KEY")
        with pytest.raises(LocalOnlyPolicyError, match="local-only"):
            resolve_provider(profile, _project("local-only"), ollama_base_url=DAEMON)

    def test_policy_is_checked_before_adapter_lookup(self):
        # Even a provider with no adapter must be refused by policy first, so the
        # error explains the real reason and nothing cloud-side is ever constructed.
        profile = _profile(provider="openai", is_local=False, api_key_ref="OPENAI_KEY")
        with pytest.raises(LocalOnlyPolicyError):
            resolve_provider(profile, _project("local-only"), ollama_base_url=DAEMON)

    def test_local_profile_allowed_on_local_only_project(self):
        provider = resolve_provider(_profile(), _project("local-only"), ollama_base_url=DAEMON)
        assert isinstance(provider, OllamaProvider)

    def test_cloud_profile_not_blocked_by_policy_on_cloud_ok_project(self):
        # Policy allows it, so the failure is only the missing adapter, not the policy.
        profile = _profile(provider="anthropic", is_local=False, api_key_ref="ANTHROPIC_KEY")
        with pytest.raises(UnsupportedProviderError):
            resolve_provider(profile, _project("cloud-ok"), ollama_base_url=DAEMON)
