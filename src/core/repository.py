"""Repository layer — data access functions."""

from typing import List, Optional

from sqlalchemy.orm import Session

from src.core.models import Project, ModelProfile, KnowledgeSource
from src.api.schemas import (
    ProjectCreate,
    ProjectUpdate,
    ModelProfileCreate,
    ModelProfileUpdate,
    KnowledgeSourceCreate,
    KnowledgeSourceUpdate,
)


# ============================================================================
# Project Repository
# ============================================================================


def create_project(db: Session, project: ProjectCreate) -> Project:
    """Create a new project."""
    db_project = Project(
        name=project.name,
        description=project.description,
        knowledge_scope_policy=project.knowledge_scope_policy,
        model_policy=project.model_policy,
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


def get_project(db: Session, project_id: int) -> Optional[Project]:
    """Get a project by ID."""
    return db.query(Project).filter(Project.id == project_id).first()


def get_project_by_name(db: Session, name: str) -> Optional[Project]:
    """Get a project by name."""
    return db.query(Project).filter(Project.name == name).first()


def list_projects(db: Session, skip: int = 0, limit: int = 100) -> List[Project]:
    """List all projects with pagination."""
    return db.query(Project).offset(skip).limit(limit).all()


def update_project(db: Session, project_id: int, project_update: ProjectUpdate) -> Optional[Project]:
    """Update a project."""
    db_project = get_project(db, project_id)
    if not db_project:
        return None

    update_data = project_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_project, field, value)

    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


def delete_project(db: Session, project_id: int) -> bool:
    """Delete a project."""
    db_project = get_project(db, project_id)
    if not db_project:
        return False

    db.delete(db_project)
    db.commit()
    return True


# ============================================================================
# ModelProfile Repository
# ============================================================================


def create_model_profile(db: Session, profile: ModelProfileCreate) -> ModelProfile:
    """Create a new model profile."""
    db_profile = ModelProfile(
        name=profile.name,
        description=profile.description,
        provider=profile.provider,
        model_id=profile.model_id,
        endpoint=profile.endpoint,
        api_key_ref=profile.api_key_ref,
        temperature=profile.temperature,
        max_tokens=profile.max_tokens,
        context_window=profile.context_window,
        cost_class=profile.cost_class,
        is_local=profile.is_local,
        is_embedding_model=profile.is_embedding_model,
    )
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile


def get_model_profile(db: Session, profile_id: int) -> Optional[ModelProfile]:
    """Get a model profile by ID."""
    return db.query(ModelProfile).filter(ModelProfile.id == profile_id).first()


def get_model_profile_by_name(db: Session, name: str) -> Optional[ModelProfile]:
    """Get a model profile by name."""
    return db.query(ModelProfile).filter(ModelProfile.name == name).first()


def list_model_profiles(db: Session, skip: int = 0, limit: int = 100) -> List[ModelProfile]:
    """List all model profiles with pagination."""
    return db.query(ModelProfile).offset(skip).limit(limit).all()


def list_local_models(db: Session) -> List[ModelProfile]:
    """List all local model profiles."""
    return db.query(ModelProfile).filter(ModelProfile.is_local == True).all()


def list_embedding_models(db: Session) -> List[ModelProfile]:
    """List all embedding model profiles."""
    return db.query(ModelProfile).filter(ModelProfile.is_embedding_model == True).all()


def update_model_profile(
    db: Session, profile_id: int, profile_update: ModelProfileUpdate
) -> Optional[ModelProfile]:
    """Update a model profile."""
    db_profile = get_model_profile(db, profile_id)
    if not db_profile:
        return None

    update_data = profile_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_profile, field, value)

    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile


def delete_model_profile(db: Session, profile_id: int) -> bool:
    """Delete a model profile."""
    db_profile = get_model_profile(db, profile_id)
    if not db_profile:
        return False

    db.delete(db_profile)
    db.commit()
    return True


# ============================================================================
# KnowledgeSource Repository
# ============================================================================


def create_knowledge_source(db: Session, source: KnowledgeSourceCreate) -> KnowledgeSource:
    """Create a new knowledge source."""
    # Verify project exists if project_id is specified
    if source.project_id:
        project = get_project(db, source.project_id)
        if not project:
            raise ValueError(f"Project {source.project_id} not found")

    db_source = KnowledgeSource(
        project_id=source.project_id,
        name=source.name,
        description=source.description,
        source_type=source.source_type,
        source_uri=source.source_uri,
        visibility=source.visibility,
    )
    db.add(db_source)
    db.commit()
    db.refresh(db_source)
    return db_source


def get_knowledge_source(db: Session, source_id: int) -> Optional[KnowledgeSource]:
    """Get a knowledge source by ID."""
    return db.query(KnowledgeSource).filter(KnowledgeSource.id == source_id).first()


def list_knowledge_sources(db: Session, skip: int = 0, limit: int = 100) -> List[KnowledgeSource]:
    """List all knowledge sources with pagination."""
    return db.query(KnowledgeSource).offset(skip).limit(limit).all()


def list_project_sources(db: Session, project_id: int, skip: int = 0, limit: int = 100) -> List[KnowledgeSource]:
    """List knowledge sources for a specific project."""
    return (
        db.query(KnowledgeSource)
        .filter(KnowledgeSource.project_id == project_id)
        .offset(skip)
        .limit(limit)
        .all()
    )


def list_org_shared_sources(db: Session, skip: int = 0, limit: int = 100) -> List[KnowledgeSource]:
    """List org-shared knowledge sources."""
    return (
        db.query(KnowledgeSource)
        .filter(KnowledgeSource.visibility == "org-shared")
        .offset(skip)
        .limit(limit)
        .all()
    )


def update_knowledge_source(
    db: Session, source_id: int, source_update: KnowledgeSourceUpdate
) -> Optional[KnowledgeSource]:
    """Update a knowledge source."""
    db_source = get_knowledge_source(db, source_id)
    if not db_source:
        return None

    update_data = source_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_source, field, value)

    db.add(db_source)
    db.commit()
    db.refresh(db_source)
    return db_source


def update_source_ingestion_status(
    db: Session, source_id: int, status: str, error: Optional[str] = None
) -> Optional[KnowledgeSource]:
    """Update the ingestion status of a knowledge source."""
    db_source = get_knowledge_source(db, source_id)
    if not db_source:
        return None

    db_source.ingestion_status = status
    if error:
        db_source.ingestion_error = error

    db.commit()
    db.refresh(db_source)
    return db_source


def delete_knowledge_source(db: Session, source_id: int) -> bool:
    """Delete a knowledge source."""
    db_source = get_knowledge_source(db, source_id)
    if not db_source:
        return False

    db.delete(db_source)
    db.commit()
    return True
