"""Resolve a ModelProfile to a configured adapter, enforcing project policy (rows 2.4, 2.5).

Policy is checked here, on the server, before any adapter is constructed. The UI
hiding a cloud option is not a control.
"""

from src.core.config import settings
from src.core.models import ModelProfile, Project
from src.llm.base import LLMProvider
from src.llm.errors import LocalOnlyPolicyError, UnsupportedProviderError
from src.llm.ollama import OllamaProvider

LOCAL_ONLY_POLICY = "local-only"

# Providers with an adapter in this build. The Claude adapter (row 2.2) is deferred.
_ADAPTERS = {"ollama"}


def resolve_provider(
    profile: ModelProfile,
    project: Project,
    *,
    ollama_base_url: str | None = None,
) -> LLMProvider:
    """Return a configured adapter for ``profile``, or raise a typed error.

    Raises:
        LocalOnlyPolicyError: the project is local-only and the profile is not local.
        UnsupportedProviderError: no adapter exists for the profile's provider.
    """
    if project.model_policy == LOCAL_ONLY_POLICY and not profile.is_local:
        raise LocalOnlyPolicyError(
            f"Project '{project.name}' is local-only; model profile '{profile.name}' "
            f"({profile.provider}) is a cloud profile and cannot be used."
        )

    if profile.provider not in _ADAPTERS:
        raise UnsupportedProviderError(
            f"No adapter for provider '{profile.provider}' in this build "
            f"(model profile '{profile.name}')."
        )

    if profile.provider == "ollama":
        base_url = profile.endpoint or ollama_base_url or settings.ollama_base_url
        return OllamaProvider(base_url=base_url)

    # Unreachable while _ADAPTERS and the branches above stay in step.
    raise UnsupportedProviderError(f"No adapter for provider '{profile.provider}'.")
