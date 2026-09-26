"""Pydantic schemas for request/response validation."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, validator


# Project schemas
class ProjectBase(BaseModel):
    """Base Project schema with common fields."""

    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=2000)
    knowledge_scope_policy: str = Field(
        default="project-private",
        description="project-private, org-shared, or hybrid",
    )
    model_policy: str = Field(
        default="cloud-ok",
        description="local-only, cloud-ok, or specific-providers",
    )

    @validator("knowledge_scope_policy")
    def validate_knowledge_scope(cls, v):
        """Validate knowledge_scope_policy is one of allowed values."""
        allowed = ["project-private", "org-shared", "hybrid"]
        if v not in allowed:
            raise ValueError(f"knowledge_scope_policy must be one of {allowed}, got {v}")
        return v

    @validator("model_policy")
    def validate_model_policy(cls, v):
        """Validate model_policy is one of allowed values."""
        allowed = ["local-only", "cloud-ok", "specific-providers"]
        if v not in allowed:
            raise ValueError(f"model_policy must be one of {allowed}, got {v}")
        return v


class ProjectCreate(ProjectBase):
    """Schema for creating a Project."""

    pass


class ProjectUpdate(BaseModel):
    """Schema for updating a Project."""

    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=2000)
    knowledge_scope_policy: Optional[str] = None
    model_policy: Optional[str] = None


class ProjectRead(ProjectBase):
    """Schema for reading a Project (includes DB fields)."""

    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        """Pydantic config."""

        from_attributes = True  # Support SQLAlchemy models


# ModelProfile schemas
class ModelProfileBase(BaseModel):
    """Base ModelProfile schema."""

    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=2000)
    provider: str = Field(
        ...,
        description="anthropic, openai, ollama, vllm, lm_studio",
    )
    model_id: str = Field(..., min_length=1, max_length=255)
    endpoint: Optional[str] = Field(None, max_length=512)
    api_key_ref: Optional[str] = Field(None, max_length=255)
    temperature: str = Field(default="0.7")
    max_tokens: Optional[int] = None
    context_window: Optional[int] = None
    cost_class: str = Field(default="moderate")
    is_local: bool = Field(default=False)
    is_embedding_model: bool = Field(default=False)

    @validator("provider")
    def validate_provider(cls, v):
        """Validate provider is supported."""
        allowed = ["anthropic", "openai", "ollama", "vllm", "lm_studio"]
        if v not in allowed:
            raise ValueError(f"provider must be one of {allowed}, got {v}")
        return v

    @validator("cost_class")
    def validate_cost_class(cls, v):
        """Validate cost_class."""
        allowed = ["free", "cheap", "moderate", "expensive"]
        if v not in allowed:
            raise ValueError(f"cost_class must be one of {allowed}, got {v}")
        return v

    @validator("api_key_ref")
    def validate_cloud_profile(cls, v, values):
        """Validate that cloud providers have api_key_ref."""
        provider = values.get("provider")
        is_local = values.get("is_local", False)

        if provider in ["anthropic", "openai"] and not is_local and not v:
            raise ValueError(
                f"Cloud provider '{provider}' requires api_key_ref or must be marked is_local=true"
            )
        return v


class ModelProfileCreate(ModelProfileBase):
    """Schema for creating a ModelProfile."""

    pass


class ModelProfileUpdate(BaseModel):
    """Schema for updating a ModelProfile."""

    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    endpoint: Optional[str] = None
    api_key_ref: Optional[str] = None
    temperature: Optional[str] = None


class ModelProfileRead(ModelProfileBase):
    """Schema for reading a ModelProfile."""

    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        """Pydantic config."""

        from_attributes = True


# KnowledgeSource schemas
class KnowledgeSourceBase(BaseModel):
    """Base KnowledgeSource schema."""

    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=2000)
    source_type: str = Field(
        ...,
        description="pdf, docx, xlsx, git_repo, confluence, jira, web_page",
    )
    source_uri: str = Field(..., max_length=512)
    visibility: str = Field(default="project-private")

    @validator("source_type")
    def validate_source_type(cls, v):
        """Validate source_type."""
        allowed = ["pdf", "docx", "xlsx", "git_repo", "confluence", "jira", "web_page"]
        if v not in allowed:
            raise ValueError(f"source_type must be one of {allowed}, got {v}")
        return v

    @validator("visibility")
    def validate_visibility(cls, v):
        """Validate visibility."""
        allowed = ["project-private", "org-shared"]
        if v not in allowed:
            raise ValueError(f"visibility must be one of {allowed}, got {v}")
        return v


class KnowledgeSourceCreate(KnowledgeSourceBase):
    """Schema for creating a KnowledgeSource."""

    project_id: Optional[int] = None


class KnowledgeSourceUpdate(BaseModel):
    """Schema for updating a KnowledgeSource."""

    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None


class KnowledgeSourceRead(KnowledgeSourceBase):
    """Schema for reading a KnowledgeSource."""

    id: int
    project_id: Optional[int]
    ingestion_status: str
    chunk_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        """Pydantic config."""

        from_attributes = True
