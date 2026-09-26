"""M1 Milestone Integration Test — Full CRUD via API."""

import pytest


def test_m1_end_to_end(test_client):
    """M1.8: Full end-to-end test — create and list resources via API.

    This is the M1 integration test. It verifies that:
    - Projects can be created and listed
    - ModelProfiles can be created and listed
    - KnowledgeSources can be created scoped to projects
    - Isolation is maintained (project A's sources don't appear in project B)
    """

    # ========================================================================
    # Create two projects
    # ========================================================================
    proj1_response = test_client.post(
        "/api/v1/projects",
        json={
            "name": "Integration Test Project 1",
            "knowledge_scope_policy": "project-private",
            "model_policy": "cloud-ok",
            "description": "First project for integration test",
        },
    )
    assert proj1_response.status_code == 201
    proj1 = proj1_response.json()
    proj1_id = proj1["id"]
    assert proj1["name"] == "Integration Test Project 1"

    proj2_response = test_client.post(
        "/api/v1/projects",
        json={
            "name": "Integration Test Project 2",
            "knowledge_scope_policy": "org-shared",
            "model_policy": "local-only",
            "description": "Second project for integration test",
        },
    )
    assert proj2_response.status_code == 201
    proj2 = proj2_response.json()
    proj2_id = proj2["id"]

    # ========================================================================
    # Create model profiles
    # ========================================================================
    cloud_profile_response = test_client.post(
        "/api/v1/model-profiles",
        json={
            "name": "Claude API",
            "provider": "anthropic",
            "model_id": "claude-3-opus",
            "api_key_ref": "sk-ant-test",
            "is_local": False,
            "cost_class": "expensive",
        },
    )
    assert cloud_profile_response.status_code == 201
    cloud_profile = cloud_profile_response.json()
    assert cloud_profile["provider"] == "anthropic"

    local_profile_response = test_client.post(
        "/api/v1/model-profiles",
        json={
            "name": "Ollama Local",
            "provider": "ollama",
            "model_id": "llama3.1:8b",
            "endpoint": "http://localhost:11434",
            "is_local": True,
            "cost_class": "free",
        },
    )
    assert local_profile_response.status_code == 201
    local_profile = local_profile_response.json()
    assert local_profile["is_local"] is True

    # ========================================================================
    # Create knowledge sources scoped to each project
    # ========================================================================
    source1_response = test_client.post(
        "/api/v1/knowledge-sources",
        json={
            "name": "Project 1 Charter",
            "source_type": "pdf",
            "source_uri": "s3://bucket/proj1/charter.pdf",
            "project_id": proj1_id,
            "visibility": "project-private",
            "description": "Charter for project 1",
        },
    )
    assert source1_response.status_code == 201
    source1 = source1_response.json()
    assert source1["project_id"] == proj1_id
    assert source1["ingestion_status"] == "pending"

    source2_response = test_client.post(
        "/api/v1/knowledge-sources",
        json={
            "name": "Project 2 Design Doc",
            "source_type": "docx",
            "source_uri": "s3://bucket/proj2/design.docx",
            "project_id": proj2_id,
            "visibility": "project-private",
        },
    )
    assert source2_response.status_code == 201
    source2 = source2_response.json()
    assert source2["project_id"] == proj2_id

    # Create an org-shared source (no project)
    shared_source_response = test_client.post(
        "/api/v1/knowledge-sources",
        json={
            "name": "Org Guidelines",
            "source_type": "pdf",
            "source_uri": "s3://bucket/shared/guidelines.pdf",
            "visibility": "org-shared",
        },
    )
    assert shared_source_response.status_code == 201
    shared_source = shared_source_response.json()
    assert shared_source["visibility"] == "org-shared"

    # ========================================================================
    # Verify isolation: project 1's sources don't appear in project 2
    # ========================================================================
    proj1_sources_response = test_client.get(
        f"/api/v1/projects/{proj1_id}/knowledge-sources"
    )
    assert proj1_sources_response.status_code == 200
    proj1_sources = proj1_sources_response.json()
    assert any(s["name"] == "Project 1 Charter" for s in proj1_sources)
    assert not any(s["name"] == "Project 2 Design Doc" for s in proj1_sources)

    proj2_sources_response = test_client.get(
        f"/api/v1/projects/{proj2_id}/knowledge-sources"
    )
    assert proj2_sources_response.status_code == 200
    proj2_sources = proj2_sources_response.json()
    assert any(s["name"] == "Project 2 Design Doc" for s in proj2_sources)
    assert not any(s["name"] == "Project 1 Charter" for s in proj2_sources)

    # ========================================================================
    # Verify org-shared sources are listed separately
    # ========================================================================
    shared_sources_response = test_client.get("/api/v1/knowledge-sources/shared")
    assert shared_sources_response.status_code == 200
    shared_sources = shared_sources_response.json()
    assert any(s["name"] == "Org Guidelines" for s in shared_sources)

    # ========================================================================
    # List all projects and verify they're there
    # ========================================================================
    all_projects_response = test_client.get("/api/v1/projects")
    assert all_projects_response.status_code == 200
    all_projects = all_projects_response.json()
    assert any(p["name"] == "Integration Test Project 1" for p in all_projects)
    assert any(p["name"] == "Integration Test Project 2" for p in all_projects)

    # ========================================================================
    # List all model profiles
    # ========================================================================
    all_profiles_response = test_client.get("/api/v1/model-profiles")
    assert all_profiles_response.status_code == 200
    all_profiles = all_profiles_response.json()
    assert any(p["name"] == "Claude API" for p in all_profiles)
    assert any(p["name"] == "Ollama Local" for p in all_profiles)

    # ========================================================================
    # List local models only
    # ========================================================================
    local_profiles_response = test_client.get("/api/v1/model-profiles?local_only=true")
    assert local_profiles_response.status_code == 200
    local_profiles = local_profiles_response.json()
    assert any(p["name"] == "Ollama Local" for p in local_profiles)
    # Cloud profile should not be there
    assert not any(p["name"] == "Claude API" for p in local_profiles)

    # ========================================================================
    # Get individual resources
    # ========================================================================
    get_proj1 = test_client.get(f"/api/v1/projects/{proj1_id}")
    assert get_proj1.status_code == 200
    assert get_proj1.json()["id"] == proj1_id

    get_source1 = test_client.get(f"/api/v1/knowledge-sources/{source1['id']}")
    assert get_source1.status_code == 200
    assert get_source1.json()["name"] == "Project 1 Charter"

    get_profile = test_client.get(f"/api/v1/model-profiles/{cloud_profile['id']}")
    assert get_profile.status_code == 200
    assert get_profile.json()["provider"] == "anthropic"

    # ========================================================================
    # Test 404 cases
    # ========================================================================
    assert test_client.get("/api/v1/projects/999").status_code == 404
    assert test_client.get("/api/v1/knowledge-sources/999").status_code == 404
    assert test_client.get("/api/v1/model-profiles/999").status_code == 404

    # ========================================================================
    # M1 COMPLETE: All CRUD operations work via API with proper isolation
    # ========================================================================
    print("\n✅ M1 Integration Test PASSED")
    print("   - Projects created and listed")
    print("   - ModelProfiles created and filtered")
    print("   - KnowledgeSources created with proper scoping")
    print("   - Project isolation verified")
    print("   - Org-shared sources accessible")
