"""Tests for FastAPI routes."""

import pytest


class TestProjectRoutes:
    """Tests for Project API routes."""

    def test_create_project(self, test_client):
        """M1.5: Create a project via API."""
        response = test_client.post(
            "/api/v1/projects",
            json={
                "name": "API Test Project",
                "knowledge_scope_policy": "project-private",
                "model_policy": "cloud-ok",
            },
        )
        assert response.status_code == 201
        data = response.json()
        assert data["id"] is not None
        assert data["name"] == "API Test Project"

    def test_get_project(self, test_client):
        """Get a project by ID via API."""
        # Create first
        create_response = test_client.post(
            "/api/v1/projects",
            json={
                "name": "Get Test",
                "knowledge_scope_policy": "project-private",
                "model_policy": "cloud-ok",
            },
        )
        project_id = create_response.json()["id"]

        # Get it
        get_response = test_client.get(f"/api/v1/projects/{project_id}")
        assert get_response.status_code == 200
        assert get_response.json()["name"] == "Get Test"

    def test_get_nonexistent_project(self, test_client):
        """Get a nonexistent project returns 404."""
        response = test_client.get("/api/v1/projects/999")
        assert response.status_code == 404

    def test_list_projects(self, test_client):
        """List projects via API."""
        # Create a few
        for i in range(3):
            test_client.post(
                "/api/v1/projects",
                json={
                    "name": f"List Test {i}",
                    "knowledge_scope_policy": "project-private",
                    "model_policy": "cloud-ok",
                },
            )

        response = test_client.get("/api/v1/projects")
        assert response.status_code == 200
        projects = response.json()
        assert len(projects) >= 3
        assert any(p["name"].startswith("List Test") for p in projects)

    def test_update_project(self, test_client):
        """Update a project via API."""
        # Create
        create_response = test_client.post(
            "/api/v1/projects",
            json={
                "name": "Update Test",
                "knowledge_scope_policy": "project-private",
                "model_policy": "cloud-ok",
            },
        )
        project_id = create_response.json()["id"]

        # Update
        update_response = test_client.patch(
            f"/api/v1/projects/{project_id}",
            json={"name": "Updated Name"},
        )
        assert update_response.status_code == 200
        assert update_response.json()["name"] == "Updated Name"

    def test_delete_project(self, test_client):
        """Delete a project via API."""
        # Create
        create_response = test_client.post(
            "/api/v1/projects",
            json={
                "name": "Delete Test",
                "knowledge_scope_policy": "project-private",
                "model_policy": "cloud-ok",
            },
        )
        project_id = create_response.json()["id"]

        # Delete
        delete_response = test_client.delete(f"/api/v1/projects/{project_id}")
        assert delete_response.status_code == 204

        # Verify it's gone
        get_response = test_client.get(f"/api/v1/projects/{project_id}")
        assert get_response.status_code == 404


class TestModelProfileRoutes:
    """Tests for ModelProfile API routes."""

    def test_create_model_profile(self, test_client):
        """Create a model profile via API."""
        response = test_client.post(
            "/api/v1/model-profiles",
            json={
                "name": "Claude API",
                "provider": "anthropic",
                "model_id": "claude-3-opus",
                "api_key_ref": "sk-ant-xyz",
                "is_local": False,
            },
        )
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Claude API"
        assert data["provider"] == "anthropic"

    def test_get_model_profile(self, test_client):
        """Get a model profile by ID via API."""
        create_response = test_client.post(
            "/api/v1/model-profiles",
            json={
                "name": "Get Profile",
                "provider": "anthropic",
                "model_id": "claude-3-opus",
                "api_key_ref": "sk-ant-xyz",
            },
        )
        profile_id = create_response.json()["id"]

        get_response = test_client.get(f"/api/v1/model-profiles/{profile_id}")
        assert get_response.status_code == 200
        assert get_response.json()["name"] == "Get Profile"

    def test_list_model_profiles(self, test_client):
        """List model profiles via API."""
        for i in range(2):
            test_client.post(
                "/api/v1/model-profiles",
                json={
                    "name": f"Profile {i}",
                    "provider": "anthropic",
                    "model_id": "claude-3-opus",
                    "api_key_ref": "sk-ant-xyz",
                },
            )

        response = test_client.get("/api/v1/model-profiles")
        assert response.status_code == 200
        profiles = response.json()
        assert len(profiles) >= 2

    def test_list_local_models_only(self, test_client):
        """Filter to local models only."""
        # Create one local, one cloud
        test_client.post(
            "/api/v1/model-profiles",
            json={
                "name": "Local Ollama",
                "provider": "ollama",
                "model_id": "llama3.1:8b",
                "is_local": True,
            },
        )
        test_client.post(
            "/api/v1/model-profiles",
            json={
                "name": "Cloud Claude",
                "provider": "anthropic",
                "model_id": "claude-3-opus",
                "api_key_ref": "sk-ant-xyz",
                "is_local": False,
            },
        )

        response = test_client.get("/api/v1/model-profiles?local_only=true")
        assert response.status_code == 200
        profiles = response.json()
        assert any(p["name"] == "Local Ollama" for p in profiles)
        # Cloud model should not be in the list (or there may be other non-local models)


class TestKnowledgeSourceRoutes:
    """Tests for KnowledgeSource API routes."""

    def test_create_knowledge_source(self, test_client):
        """Create a knowledge source via API."""
        # First create a project
        project_response = test_client.post(
            "/api/v1/projects",
            json={
                "name": "Source Test Project",
                "knowledge_scope_policy": "project-private",
                "model_policy": "cloud-ok",
            },
        )
        project_id = project_response.json()["id"]

        # Create source
        response = test_client.post(
            "/api/v1/knowledge-sources",
            json={
                "name": "Charter PDF",
                "source_type": "pdf",
                "source_uri": "s3://bucket/charter.pdf",
                "project_id": project_id,
            },
        )
        assert response.status_code == 201
        data = response.json()
        assert data["project_id"] == project_id
        assert data["ingestion_status"] == "pending"

    def test_create_knowledge_source_invalid_project(self, test_client):
        """Create source with invalid project_id returns 400."""
        response = test_client.post(
            "/api/v1/knowledge-sources",
            json={
                "name": "Bad Source",
                "source_type": "pdf",
                "source_uri": "s3://bucket/file.pdf",
                "project_id": 999,  # Nonexistent
            },
        )
        assert response.status_code == 400

    def test_get_knowledge_source(self, test_client):
        """Get a knowledge source by ID via API."""
        # Create source
        create_response = test_client.post(
            "/api/v1/knowledge-sources",
            json={
                "name": "Get Source",
                "source_type": "docx",
                "source_uri": "s3://bucket/file.docx",
            },
        )
        source_id = create_response.json()["id"]

        get_response = test_client.get(f"/api/v1/knowledge-sources/{source_id}")
        assert get_response.status_code == 200
        assert get_response.json()["name"] == "Get Source"

    def test_list_project_sources(self, test_client):
        """List sources for a specific project."""
        # Create project
        project_response = test_client.post(
            "/api/v1/projects",
            json={
                "name": "List Sources Project",
                "knowledge_scope_policy": "project-private",
                "model_policy": "cloud-ok",
            },
        )
        project_id = project_response.json()["id"]

        # Create sources
        test_client.post(
            "/api/v1/knowledge-sources",
            json={
                "name": "Source 1",
                "source_type": "pdf",
                "source_uri": "s3://bucket/1.pdf",
                "project_id": project_id,
            },
        )
        test_client.post(
            "/api/v1/knowledge-sources",
            json={
                "name": "Source 2",
                "source_type": "docx",
                "source_uri": "s3://bucket/2.docx",
                "project_id": project_id,
            },
        )

        response = test_client.get(f"/api/v1/projects/{project_id}/knowledge-sources")
        assert response.status_code == 200
        sources = response.json()
        assert len(sources) >= 2
        assert any(s["name"] == "Source 1" for s in sources)

    def test_list_org_shared_sources(self, test_client):
        """List org-shared sources."""
        test_client.post(
            "/api/v1/knowledge-sources",
            json={
                "name": "Shared",
                "source_type": "pdf",
                "source_uri": "s3://bucket/shared.pdf",
                "visibility": "org-shared",
            },
        )

        response = test_client.get("/api/v1/knowledge-sources/shared")
        assert response.status_code == 200
        sources = response.json()
        assert any(s["name"] == "Shared" for s in sources)
