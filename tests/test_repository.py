"""Tests for repository functions."""

import pytest

from src.api.schemas import (
    ProjectCreate,
    ProjectUpdate,
    ModelProfileCreate,
    KnowledgeSourceCreate,
)
from src.core.repository import (
    create_project,
    get_project,
    list_projects,
    update_project,
    delete_project,
    create_model_profile,
    get_model_profile,
    list_model_profiles,
    list_local_models,
    create_knowledge_source,
    get_knowledge_source,
    list_project_sources,
    list_org_shared_sources,
)


class TestProjectRepository:
    """Tests for Project repository functions."""

    def test_create_project(self, db_session):
        """M1.4: Create a project via repository."""
        schema = ProjectCreate(
            name="Repo Test Project",
            knowledge_scope_policy="project-private",
            model_policy="cloud-ok",
        )
        project = create_project(db_session, schema)

        assert project.id is not None
        assert project.name == "Repo Test Project"
        assert project.knowledge_scope_policy == "project-private"

    def test_get_project(self, db_session):
        """Get a project by ID."""
        schema = ProjectCreate(name="Get Test", knowledge_scope_policy="project-private", model_policy="cloud-ok")
        created = create_project(db_session, schema)

        retrieved = get_project(db_session, created.id)
        assert retrieved is not None
        assert retrieved.id == created.id
        assert retrieved.name == "Get Test"

    def test_get_nonexistent_project(self, db_session):
        """Get a nonexistent project returns None."""
        result = get_project(db_session, 999)
        assert result is None

    def test_list_projects(self, db_session):
        """List projects with pagination."""
        for i in range(3):
            schema = ProjectCreate(
                name=f"List Test {i}",
                knowledge_scope_policy="project-private",
                model_policy="cloud-ok",
            )
            create_project(db_session, schema)

        projects = list_projects(db_session, skip=0, limit=10)
        assert len(projects) >= 3
        assert any(p.name.startswith("List Test") for p in projects)

    def test_update_project(self, db_session):
        """Update a project."""
        schema = ProjectCreate(name="Update Test", knowledge_scope_policy="project-private", model_policy="cloud-ok")
        project = create_project(db_session, schema)

        update_schema = ProjectUpdate(name="Updated Name")
        updated = update_project(db_session, project.id, update_schema)

        assert updated is not None
        assert updated.name == "Updated Name"
        assert updated.knowledge_scope_policy == "project-private"  # Unchanged

    def test_delete_project(self, db_session):
        """Delete a project."""
        schema = ProjectCreate(name="Delete Test", knowledge_scope_policy="project-private", model_policy="cloud-ok")
        project = create_project(db_session, schema)

        result = delete_project(db_session, project.id)
        assert result is True

        deleted = get_project(db_session, project.id)
        assert deleted is None


class TestModelProfileRepository:
    """Tests for ModelProfile repository functions."""

    def test_create_model_profile_cloud(self, db_session):
        """Create a cloud model profile."""
        schema = ModelProfileCreate(
            name="Claude API",
            provider="anthropic",
            model_id="claude-3-opus",
            api_key_ref="sk-ant-xyz",
            is_local=False,
        )
        profile = create_model_profile(db_session, schema)

        assert profile.id is not None
        assert profile.name == "Claude API"
        assert profile.provider == "anthropic"
        assert profile.is_local is False

    def test_create_model_profile_local(self, db_session):
        """Create a local model profile."""
        schema = ModelProfileCreate(
            name="Llama Local",
            provider="ollama",
            model_id="llama3.1:8b",
            endpoint="http://localhost:11434",
            is_local=True,
        )
        profile = create_model_profile(db_session, schema)

        assert profile.id is not None
        assert profile.is_local is True

    def test_get_model_profile(self, db_session):
        """Get a model profile by ID."""
        schema = ModelProfileCreate(
            name="Get Profile",
            provider="anthropic",
            model_id="claude-3-opus",
            api_key_ref="sk-ant-xyz",
        )
        created = create_model_profile(db_session, schema)

        retrieved = get_model_profile(db_session, created.id)
        assert retrieved is not None
        assert retrieved.name == "Get Profile"

    def test_list_local_models(self, db_session):
        """List only local models."""
        # Create one local, one cloud
        create_model_profile(
            db_session,
            ModelProfileCreate(
                name="Local Ollama",
                provider="ollama",
                model_id="llama3.1:8b",
                is_local=True,
            ),
        )
        create_model_profile(
            db_session,
            ModelProfileCreate(
                name="Cloud Claude",
                provider="anthropic",
                model_id="claude-3-opus",
                api_key_ref="sk-ant-xyz",
                is_local=False,
            ),
        )

        local_models = list_local_models(db_session)
        assert any(p.name == "Local Ollama" for p in local_models)
        assert not any(p.name == "Cloud Claude" for p in local_models)

    def test_list_model_profiles(self, db_session):
        """List all model profiles."""
        for i in range(2):
            create_model_profile(
                db_session,
                ModelProfileCreate(
                    name=f"Profile {i}",
                    provider="anthropic",
                    model_id="claude-3-opus",
                    api_key_ref="sk-ant-xyz",
                ),
            )

        profiles = list_model_profiles(db_session)
        assert len(profiles) >= 2


class TestKnowledgeSourceRepository:
    """Tests for KnowledgeSource repository functions."""

    def test_create_knowledge_source(self, db_session):
        """Create a knowledge source for a project."""
        project_schema = ProjectCreate(name="Source Test", knowledge_scope_policy="project-private", model_policy="cloud-ok")
        project = create_project(db_session, project_schema)

        source_schema = KnowledgeSourceCreate(
            name="Charter PDF",
            source_type="pdf",
            source_uri="s3://bucket/charter.pdf",
            project_id=project.id,
        )
        source = create_knowledge_source(db_session, source_schema)

        assert source.id is not None
        assert source.project_id == project.id
        assert source.ingestion_status == "pending"

    def test_create_knowledge_source_invalid_project(self, db_session):
        """Creating source with invalid project_id raises error."""
        source_schema = KnowledgeSourceCreate(
            name="Bad Source",
            source_type="pdf",
            source_uri="s3://bucket/file.pdf",
            project_id=999,  # Nonexistent
        )
        with pytest.raises(ValueError) as exc_info:
            create_knowledge_source(db_session, source_schema)
        assert "not found" in str(exc_info.value)

    def test_list_project_sources(self, db_session):
        """List sources for a specific project."""
        # Create two projects
        proj1 = create_project(db_session, ProjectCreate(name="Proj1", knowledge_scope_policy="project-private", model_policy="cloud-ok"))
        proj2 = create_project(db_session, ProjectCreate(name="Proj2", knowledge_scope_policy="project-private", model_policy="cloud-ok"))

        # Create sources for each
        create_knowledge_source(
            db_session,
            KnowledgeSourceCreate(
                name="Source 1A",
                source_type="pdf",
                source_uri="s3://bucket/1a.pdf",
                project_id=proj1.id,
            ),
        )
        create_knowledge_source(
            db_session,
            KnowledgeSourceCreate(
                name="Source 2A",
                source_type="docx",
                source_uri="s3://bucket/2a.docx",
                project_id=proj2.id,
            ),
        )

        # List for proj1
        sources1 = list_project_sources(db_session, proj1.id)
        assert any(s.name == "Source 1A" for s in sources1)
        assert not any(s.name == "Source 2A" for s in sources1)

    def test_list_org_shared_sources(self, db_session):
        """List org-shared sources."""
        create_knowledge_source(
            db_session,
            KnowledgeSourceCreate(
                name="Shared Source",
                source_type="pdf",
                source_uri="s3://bucket/shared.pdf",
                visibility="org-shared",
            ),
        )
        create_knowledge_source(
            db_session,
            KnowledgeSourceCreate(
                name="Private Source",
                source_type="docx",
                source_uri="s3://bucket/private.docx",
                visibility="project-private",
            ),
        )

        shared = list_org_shared_sources(db_session)
        assert any(s.name == "Shared Source" for s in shared)
        assert not any(s.name == "Private Source" for s in shared)

    def test_get_knowledge_source(self, db_session):
        """Get a knowledge source by ID."""
        source_schema = KnowledgeSourceCreate(
            name="Get Source",
            source_type="xlsx",
            source_uri="s3://bucket/file.xlsx",
        )
        created = create_knowledge_source(db_session, source_schema)

        retrieved = get_knowledge_source(db_session, created.id)
        assert retrieved is not None
        assert retrieved.name == "Get Source"
