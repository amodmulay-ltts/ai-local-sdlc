"""Tests for Project model."""

import pytest
from datetime import datetime
from src.core.models import Project


def test_project_create_and_read(db_session):
    """M1.1: Create and read a Project round-trip."""
    project = Project(
        name="Test Project",
        knowledge_scope_policy="project-private",
        model_policy="cloud-ok",
    )
    db_session.add(project)
    db_session.commit()

    # Read it back
    retrieved = db_session.query(Project).filter_by(name="Test Project").first()
    assert retrieved is not None
    assert retrieved.id is not None
    assert retrieved.name == "Test Project"
    assert retrieved.knowledge_scope_policy == "project-private"
    assert retrieved.model_policy == "cloud-ok"
    assert isinstance(retrieved.created_at, datetime)
    assert isinstance(retrieved.updated_at, datetime)


def test_project_defaults(db_session):
    """Verify Project default values."""
    project = Project(
        name="Defaults Test",
        knowledge_scope_policy="project-private",
        model_policy="cloud-ok",
    )
    db_session.add(project)
    db_session.commit()

    retrieved = db_session.query(Project).filter_by(name="Defaults Test").first()
    assert retrieved.created_at is not None
    assert retrieved.updated_at is not None


def test_project_timestamps_update(db_session):
    """Verify timestamps are set on create and update."""
    project = Project(
        name="Timestamp Test",
        knowledge_scope_policy="project-private",
        model_policy="cloud-ok",
    )
    db_session.add(project)
    db_session.commit()

    original_created = project.created_at
    original_updated = project.updated_at

    # Modify and update
    project.name = "Timestamp Test Updated"
    db_session.commit()

    # Refresh from DB
    retrieved = db_session.query(Project).filter_by(id=project.id).first()
    assert retrieved.created_at == original_created  # created_at should not change
    assert retrieved.updated_at >= original_updated  # updated_at should be >= original
