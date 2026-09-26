"""Tests for Pydantic schemas."""

import pytest
from pydantic import ValidationError

from src.api.schemas import ProjectCreate, ProjectRead, ModelProfileCreate, KnowledgeSourceCreate


class TestProjectSchema:
    """Tests for Project schemas."""

    def test_project_create_valid(self):
        """M1.3: Valid ProjectCreate passes validation."""
        data = {
            "name": "Test Project",
            "knowledge_scope_policy": "project-private",
            "model_policy": "cloud-ok",
        }
        schema = ProjectCreate(**data)
        assert schema.name == "Test Project"
        assert schema.knowledge_scope_policy == "project-private"

    def test_project_create_invalid_knowledge_scope(self):
        """Invalid knowledge_scope_policy raises ValidationError."""
        data = {
            "name": "Test Project",
            "knowledge_scope_policy": "invalid-policy",
            "model_policy": "cloud-ok",
        }
        with pytest.raises(ValidationError) as exc_info:
            ProjectCreate(**data)
        assert "knowledge_scope_policy" in str(exc_info.value)

    def test_project_create_invalid_model_policy(self):
        """Invalid model_policy raises ValidationError."""
        data = {
            "name": "Test Project",
            "knowledge_scope_policy": "project-private",
            "model_policy": "invalid-policy",
        }
        with pytest.raises(ValidationError) as exc_info:
            ProjectCreate(**data)
        assert "model_policy" in str(exc_info.value)

    def test_project_create_defaults(self):
        """ProjectCreate has sensible defaults."""
        data = {"name": "Test"}
        schema = ProjectCreate(**data)
        assert schema.knowledge_scope_policy == "project-private"
        assert schema.model_policy == "cloud-ok"

    def test_project_create_empty_name(self):
        """Empty name raises ValidationError."""
        data = {
            "name": "",
            "knowledge_scope_policy": "project-private",
            "model_policy": "cloud-ok",
        }
        with pytest.raises(ValidationError):
            ProjectCreate(**data)


class TestModelProfileSchema:
    """Tests for ModelProfile schemas."""

    def test_model_profile_create_valid_cloud(self):
        """Valid cloud ModelProfile passes validation."""
        data = {
            "name": "Claude API",
            "provider": "anthropic",
            "model_id": "claude-3-opus",
            "api_key_ref": "sk-ant-xyz",
            "is_local": False,
        }
        schema = ModelProfileCreate(**data)
        assert schema.name == "Claude API"
        assert schema.provider == "anthropic"

    def test_model_profile_create_valid_local(self):
        """Valid local ModelProfile passes validation."""
        data = {
            "name": "Local Llama",
            "provider": "ollama",
            "model_id": "llama3.1:8b",
            "endpoint": "http://localhost:11434",
            "is_local": True,
        }
        schema = ModelProfileCreate(**data)
        assert schema.provider == "ollama"
        assert schema.is_local is True

    def test_model_profile_cloud_without_api_key(self):
        """Cloud provider without api_key_ref raises ValidationError."""
        data = {
            "name": "Bad Cloud",
            "provider": "anthropic",
            "model_id": "claude-3-opus",
            "is_local": False,
            # Missing api_key_ref
        }
        with pytest.raises(ValidationError) as exc_info:
            ModelProfileCreate(**data)
        assert "api_key_ref" in str(exc_info.value)

    def test_model_profile_invalid_provider(self):
        """Invalid provider raises ValidationError."""
        data = {
            "name": "Bad Provider",
            "provider": "invalid-provider",
            "model_id": "some-model",
        }
        with pytest.raises(ValidationError) as exc_info:
            ModelProfileCreate(**data)
        assert "provider" in str(exc_info.value)

    def test_model_profile_invalid_cost_class(self):
        """Invalid cost_class raises ValidationError."""
        data = {
            "name": "Bad Cost",
            "provider": "anthropic",
            "model_id": "claude-3-opus",
            "api_key_ref": "sk-ant-xyz",
            "cost_class": "ultra-expensive",
        }
        with pytest.raises(ValidationError) as exc_info:
            ModelProfileCreate(**data)
        assert "cost_class" in str(exc_info.value)


class TestKnowledgeSourceSchema:
    """Tests for KnowledgeSource schemas."""

    def test_knowledge_source_create_valid(self):
        """Valid KnowledgeSourceCreate passes validation."""
        data = {
            "name": "Project Charter",
            "source_type": "pdf",
            "source_uri": "s3://bucket/charter.pdf",
            "project_id": 1,
        }
        schema = KnowledgeSourceCreate(**data)
        assert schema.name == "Project Charter"
        assert schema.source_type == "pdf"

    def test_knowledge_source_invalid_type(self):
        """Invalid source_type raises ValidationError."""
        data = {
            "name": "Bad Source",
            "source_type": "invalid-type",
            "source_uri": "s3://bucket/file",
        }
        with pytest.raises(ValidationError) as exc_info:
            KnowledgeSourceCreate(**data)
        assert "source_type" in str(exc_info.value)

    def test_knowledge_source_invalid_visibility(self):
        """Invalid visibility raises ValidationError."""
        data = {
            "name": "Bad Visibility",
            "source_type": "docx",
            "source_uri": "s3://bucket/file.docx",
            "visibility": "super-secret",
        }
        with pytest.raises(ValidationError) as exc_info:
            KnowledgeSourceCreate(**data)
        assert "visibility" in str(exc_info.value)

    def test_knowledge_source_defaults(self):
        """KnowledgeSourceCreate has sensible defaults."""
        data = {
            "name": "Charter",
            "source_type": "pdf",
            "source_uri": "s3://bucket/file.pdf",
        }
        schema = KnowledgeSourceCreate(**data)
        assert schema.visibility == "project-private"
