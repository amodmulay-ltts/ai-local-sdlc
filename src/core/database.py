"""Database setup and session management."""

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import NullPool

from .config import settings

# Base class for all models (needed for Alembic)
Base = declarative_base()


def get_engine():
    """Get or create the database engine."""
    engine = create_engine(
        settings.database_url,
        echo=settings.api_debug,
        poolclass=NullPool if "sqlite" in settings.database_url else None,
    )
    return engine


def get_session_factory(engine=None):
    """Get the SessionLocal factory."""
    if engine is None:
        engine = get_engine()
    return sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Default engine and session factory (created on demand)
engine = None
SessionLocal = None


def get_db():
    """Dependency for getting DB session in FastAPI."""
    global engine, SessionLocal
    if engine is None:
        engine = get_engine()
        SessionLocal = get_session_factory(engine)

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Import models so they're registered with Base (required for Alembic)
# This needs to be at the end to avoid circular imports
from . import models as _models  # noqa: E402, F401
