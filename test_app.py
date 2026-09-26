#!/usr/bin/env python
"""Quick test script to verify the app works."""

import sys
import json

# Test 1: Import the app
print("=" * 60)
print("TEST 1: Importing the FastAPI app...")
print("=" * 60)
try:
    from src.api.main import app
    print("✅ FastAPI app imported successfully")
except Exception as e:
    print(f"❌ Failed to import app: {e}")
    sys.exit(1)

# Test 2: Use TestClient to call the API
print("\n" + "=" * 60)
print("TEST 2: Testing API endpoints with TestClient...")
print("=" * 60)
try:
    from starlette.testclient import TestClient
    from src.core.database import SessionLocal, Base, engine

    # Create tables
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created")

    client = TestClient(app)

    # Test root endpoint
    print("\n[GET /] Root endpoint:")
    response = client.get("/")
    print(f"  Status: {response.status_code}")
    print(f"  Response: {json.dumps(response.json(), indent=2)}")

    # Test health check
    print("\n[GET /health] Health check:")
    response = client.get("/health")
    print(f"  Status: {response.status_code}")
    print(f"  Response: {json.dumps(response.json(), indent=2)}")

    # Test OpenAPI schema
    print("\n[GET /openapi.json] OpenAPI schema available:")
    response = client.get("/openapi.json")
    print(f"  Status: {response.status_code}")
    if response.status_code == 200:
        schema = response.json()
        print(f"  API Title: {schema.get('info', {}).get('title')}")
        print(f"  API Version: {schema.get('info', {}).get('version')}")
        print(f"  Endpoints: {len(schema.get('paths', {}))}")

except Exception as e:
    print(f"❌ Test failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# Test 3: Test CRUD operations
print("\n" + "=" * 60)
print("TEST 3: Testing CRUD API endpoints...")
print("=" * 60)
try:
    from starlette.testclient import TestClient

    client = TestClient(app)

    # Create a project
    print("\n[POST /api/v1/projects] Create project:")
    create_response = client.post(
        "/api/v1/projects",
        json={
            "name": "Demo Project",
            "knowledge_scope_policy": "project-private",
            "model_policy": "cloud-ok",
            "description": "A demo project to show the app running",
        },
    )
    print(f"  Status: {create_response.status_code}")
    project = create_response.json()
    print(f"  Response: {json.dumps(project, indent=2)}")
    project_id = project.get("id")

    if project_id:
        # Get the project
        print(f"\n[GET /api/v1/projects/{project_id}] Get project:")
        get_response = client.get(f"/api/v1/projects/{project_id}")
        print(f"  Status: {get_response.status_code}")
        print(f"  Response: {json.dumps(get_response.json(), indent=2)}")

        # List projects
        print("\n[GET /api/v1/projects] List projects:")
        list_response = client.get("/api/v1/projects")
        print(f"  Status: {list_response.status_code}")
        projects = list_response.json()
        print(f"  Total projects: {len(projects)}")
        for p in projects:
            print(f"    - {p['name']} (id={p['id']})")

        # Create a model profile
        print("\n[POST /api/v1/model-profiles] Create model profile:")
        profile_response = client.post(
            "/api/v1/model-profiles",
            json={
                "name": "Claude API Demo",
                "provider": "anthropic",
                "model_id": "claude-3-opus",
                "api_key_ref": "sk-ant-demo",
                "is_local": False,
            },
        )
        print(f"  Status: {profile_response.status_code}")
        profile = profile_response.json()
        print(f"  Response: {json.dumps(profile, indent=2)}")
        profile_id = profile.get("id")

        # Create a knowledge source
        print("\n[POST /api/v1/knowledge-sources] Create knowledge source:")
        source_response = client.post(
            "/api/v1/knowledge-sources",
            json={
                "name": "Architecture Document",
                "source_type": "pdf",
                "source_uri": "s3://bucket/architecture.pdf",
                "project_id": project_id,
                "visibility": "project-private",
            },
        )
        print(f"  Status: {source_response.status_code}")
        source = source_response.json()
        print(f"  Response: {json.dumps(source, indent=2)}")

        print("\n✅ All CRUD operations successful!")

except Exception as e:
    print(f"❌ CRUD test failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\n" + "=" * 60)
print("✅ ALL TESTS PASSED")
print("=" * 60)
print("\n📝 App is working! You can now:")
print("   1. Run: python -m uvicorn src.api.main:app --reload")
print("   2. Open: http://localhost:8000/docs (Swagger UI)")
print("   3. Open: http://localhost:8000/redoc (ReDoc)")
print("=" * 60)
