"""FastAPI routes for CRUD operations."""

from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.core.database import get_db
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
from src.api.schemas import (
    ProjectCreate,
    ProjectRead,
    ProjectUpdate,
    ModelProfileCreate,
    ModelProfileRead,
    ModelProfileUpdate,
    KnowledgeSourceCreate,
    KnowledgeSourceRead,
    KnowledgeSourceUpdate,
)

router = APIRouter(prefix="/api/v1", tags=["resources"])


# ============================================================================
# Project Routes
# ============================================================================


@router.post("/projects", response_model=ProjectRead, status_code=201)
def create_project_route(
    project: ProjectCreate,
    db: Session = Depends(get_db),
):
    """Create a new project."""
    return create_project(db, project)


@router.get("/projects/{project_id}", response_model=ProjectRead)
def get_project_route(
    project_id: int,
    db: Session = Depends(get_db),
):
    """Get a project by ID."""
    db_project = get_project(db, project_id)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project


@router.get("/projects", response_model=List[ProjectRead])
def list_projects_route(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """List all projects."""
    return list_projects(db, skip=skip, limit=limit)


@router.patch("/projects/{project_id}", response_model=ProjectRead)
def update_project_route(
    project_id: int,
    project_update: ProjectUpdate,
    db: Session = Depends(get_db),
):
    """Update a project."""
    db_project = update_project(db, project_id, project_update)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project


@router.delete("/projects/{project_id}", status_code=204)
def delete_project_route(
    project_id: int,
    db: Session = Depends(get_db),
):
    """Delete a project."""
    success = delete_project(db, project_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")
    return None


# ============================================================================
# ModelProfile Routes
# ============================================================================


@router.post("/model-profiles", response_model=ModelProfileRead, status_code=201)
def create_model_profile_route(
    profile: ModelProfileCreate,
    db: Session = Depends(get_db),
):
    """Create a new model profile."""
    return create_model_profile(db, profile)


@router.get("/model-profiles/{profile_id}", response_model=ModelProfileRead)
def get_model_profile_route(
    profile_id: int,
    db: Session = Depends(get_db),
):
    """Get a model profile by ID."""
    db_profile = get_model_profile(db, profile_id)
    if not db_profile:
        raise HTTPException(status_code=404, detail="Model profile not found")
    return db_profile


@router.get("/model-profiles", response_model=List[ModelProfileRead])
def list_model_profiles_route(
    skip: int = 0,
    limit: int = 100,
    local_only: bool = False,
    db: Session = Depends(get_db),
):
    """List model profiles."""
    if local_only:
        return list_local_models(db)
    return list_model_profiles(db, skip=skip, limit=limit)


@router.patch("/model-profiles/{profile_id}", response_model=ModelProfileRead)
def update_model_profile_route(
    profile_id: int,
    profile_update: ModelProfileUpdate,
    db: Session = Depends(get_db),
):
    """Update a model profile."""
    from src.core.repository import update_model_profile

    db_profile = update_model_profile(db, profile_id, profile_update)
    if not db_profile:
        raise HTTPException(status_code=404, detail="Model profile not found")
    return db_profile


@router.delete("/model-profiles/{profile_id}", status_code=204)
def delete_model_profile_route(
    profile_id: int,
    db: Session = Depends(get_db),
):
    """Delete a model profile."""
    from src.core.repository import delete_model_profile

    success = delete_model_profile(db, profile_id)
    if not success:
        raise HTTPException(status_code=404, detail="Model profile not found")
    return None


# ============================================================================
# KnowledgeSource Routes
# ============================================================================


@router.post("/knowledge-sources", response_model=KnowledgeSourceRead, status_code=201)
def create_knowledge_source_route(
    source: KnowledgeSourceCreate,
    db: Session = Depends(get_db),
):
    """Create a new knowledge source."""
    try:
        return create_knowledge_source(db, source)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/knowledge-sources/shared", response_model=List[KnowledgeSourceRead])
def list_org_shared_sources_route(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """List org-shared knowledge sources."""
    return list_org_shared_sources(db, skip=skip, limit=limit)


@router.get("/projects/{project_id}/knowledge-sources", response_model=List[KnowledgeSourceRead])
def list_project_sources_route(
    project_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """List knowledge sources for a project."""
    # Verify project exists
    if not get_project(db, project_id):
        raise HTTPException(status_code=404, detail="Project not found")

    return list_project_sources(db, project_id, skip=skip, limit=limit)


@router.get("/knowledge-sources/{source_id}", response_model=KnowledgeSourceRead)
def get_knowledge_source_route(
    source_id: int,
    db: Session = Depends(get_db),
):
    """Get a knowledge source by ID."""
    db_source = get_knowledge_source(db, source_id)
    if not db_source:
        raise HTTPException(status_code=404, detail="Knowledge source not found")
    return db_source


@router.patch("/knowledge-sources/{source_id}", response_model=KnowledgeSourceRead)
def update_knowledge_source_route(
    source_id: int,
    source_update: KnowledgeSourceUpdate,
    db: Session = Depends(get_db),
):
    """Update a knowledge source."""
    from src.core.repository import update_knowledge_source

    db_source = update_knowledge_source(db, source_id, source_update)
    if not db_source:
        raise HTTPException(status_code=404, detail="Knowledge source not found")
    return db_source


@router.delete("/knowledge-sources/{source_id}", status_code=204)
def delete_knowledge_source_route(
    source_id: int,
    db: Session = Depends(get_db),
):
    """Delete a knowledge source."""
    from src.core.repository import delete_knowledge_source

    success = delete_knowledge_source(db, source_id)
    if not success:
        raise HTTPException(status_code=404, detail="Knowledge source not found")
    return None
