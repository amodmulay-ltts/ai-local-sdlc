"""Pytest configuration and shared fixtures."""

import os
from typing import Generator

import pytest
from sqlalchemy import create_engine, event
from sqlalchemy.orm import Session, sessionmaker
from starlette.testclient import TestClient

# Use SQLite in-memory for fast tests (no Docker required)
# Override with TEST_DATABASE_URL env var to use real Postgres if needed
TEST_DATABASE_URL = os.getenv("TEST_DATABASE_URL", "sqlite:///:memory:")


@pytest.fixture(scope="session")
def db_engine():
    """Create a database engine for testing."""
    # Create engine
    engine = create_engine(
        TEST_DATABASE_URL,
        connect_args={"check_same_thread": False} if "sqlite" in TEST_DATABASE_URL else {},
    )

    # Enable foreign keys for SQLite
    if "sqlite" in TEST_DATABASE_URL:
        @event.listens_for(engine, "connect")
        def set_sqlite_pragma(dbapi_conn, connection_record):
            cursor = dbapi_conn.cursor()
            cursor.execute("PRAGMA foreign_keys=ON")
            cursor.close()

    # Create all tables from models
    from src.core.database import Base
    Base.metadata.create_all(bind=engine)

    yield engine

    # Cleanup
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def db_session(db_engine) -> Generator[Session, None, None]:
    """Create a new database session for each test."""
    connection = db_engine.connect()
    transaction = connection.begin()
    session = sessionmaker(autocommit=False, autoflush=False, bind=connection)()

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture
def test_client(db_session: Session) -> TestClient:
    """Provide a test client for the FastAPI app."""
    from src.api.main import app
    from src.core.database import get_db

    # Override the get_db dependency to use our test session
    def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    client = TestClient(app)

    yield client

    # Cleanup
    app.dependency_overrides.clear()
