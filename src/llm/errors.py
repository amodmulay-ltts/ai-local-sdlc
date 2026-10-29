"""Typed errors for the LLM layer."""


class LLMError(RuntimeError):
    """A provider call failed (unreachable, HTTP error, malformed response)."""


class UnsupportedProviderError(ValueError):
    """The ModelProfile names a provider with no adapter in this build."""


class LocalOnlyPolicyError(PermissionError):
    """A cloud ModelProfile was used on a project whose model policy is local-only."""
