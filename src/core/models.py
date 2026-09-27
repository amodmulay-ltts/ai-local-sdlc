"""SQLAlchemy models for the Engineering Intelligence Factory."""

from datetime import datetime

from sqlalchemy import Column, DateTime, Enum, Integer, String, Text, Boolean
from sqlalchemy.orm import relationship

from src.core.database import Base


class Project(Base):
    """Project model — top-level container for a knowledge base and its artifacts."""

    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)

    # Knowledge scope: project-private, org-shared, hybrid
    knowledge_scope_policy = Column(String(50), nullable=False, default="project-private")

    # Model policy: local-only, cloud-ok, specific-providers
    model_policy = Column(String(50), nullable=False, default="cloud-ok")

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships (defined later when other models exist)
    # knowledge_sources = relationship("KnowledgeSource", back_populates="project")
    # model_profiles = relationship("ModelProfile", back_populates="project")

    def __repr__(self) -> str:
        return f"<Project(id={self.id}, name={self.name}, policy={self.knowledge_scope_policy})>"


class ModelProfile(Base):
    """ModelProfile — configuration for an LLM provider (local or cloud)."""

    __tablename__ = "model_profiles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)

    # Provider type: anthropic, openai, ollama, vllm, lm_studio
    provider = Column(String(50), nullable=False)

    # Model identifier (e.g., "claude-3-opus", "gpt-4", "llama3.1:8b")
    model_id = Column(String(255), nullable=False)

    # Endpoint (required for cloud providers and some local setups)
    endpoint = Column(String(512), nullable=True)

    # API key reference (for cloud; would be retrieved from secrets manager in production)
    # For now, stored as plaintext (NOT recommended for production)
    api_key_ref = Column(String(255), nullable=True)

    # Model parameters
    temperature = Column(String(10), default="0.7", nullable=False)
    max_tokens = Column(Integer, nullable=True)
    context_window = Column(Integer, nullable=True)

    # Cost class: free, cheap, moderate, expensive
    cost_class = Column(String(20), default="moderate", nullable=False)

    # Metadata
    is_local = Column(Boolean, default=False, nullable=False)
    is_embedding_model = Column(Boolean, default=False, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def __repr__(self) -> str:
        return f"<ModelProfile(id={self.id}, name={self.name}, provider={self.provider}, model={self.model_id})>"


class KnowledgeSource(Base):
    """KnowledgeSource — one ingested document/resource (PDF, DOCX, Git repo, etc.)."""

    __tablename__ = "knowledge_sources"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, nullable=True, index=True)  # nullable: org-shared sources have no project

    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)

    # Source type: pdf, docx, xlsx, git_repo, confluence, jira, web_page
    source_type = Column(String(50), nullable=False)

    # Source location (file key in S3, git URL, web URL, etc.)
    source_uri = Column(String(512), nullable=False)

    # Visibility: project-private, org-shared
    visibility = Column(String(50), nullable=False, default="project-private")

    # Ingestion status: pending, processing, done, error
    ingestion_status = Column(String(50), nullable=False, default="pending")
    ingestion_error = Column(Text, nullable=True)

    # Metadata
    file_size_bytes = Column(Integer, nullable=True)
    chunk_count = Column(Integer, default=0, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def __repr__(self) -> str:
        return f"<KnowledgeSource(id={self.id}, name={self.name}, type={self.source_type}, status={self.ingestion_status})>"


class Chunk(Base):
    """Chunk — one semantic chunk of text from a KnowledgeSource with embeddings."""

    __tablename__ = "chunks"

    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(Integer, nullable=False, index=True)

    # Content
    text = Column(Text, nullable=False)

    # Provenance (where in the source this came from)
    page_number = Column(Integer, nullable=True)
    section_title = Column(String(255), nullable=True)
    source_ref = Column(String(255), nullable=True)  # e.g., "commit abc123" for git

    # Token count for budgeting
    token_count = Column(Integer, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self) -> str:
        return f"<Chunk(id={self.id}, source_id={self.source_id}, tokens={self.token_count})>"


class CallLog(Base):
    """CallLog — record of each LLM API call for cost/token accounting."""

    __tablename__ = "call_logs"

    id = Column(Integer, primary_key=True, index=True)

    # What was called
    provider = Column(String(50), nullable=False)
    model_id = Column(String(255), nullable=False)

    # Tokens / cost
    input_tokens = Column(Integer, nullable=True)
    output_tokens = Column(Integer, nullable=True)
    total_tokens = Column(Integer, nullable=True)
    estimated_cost = Column(String(20), nullable=True)  # Cost class as string for now

    # Performance
    latency_ms = Column(Integer, nullable=True)

    # Context
    playbook_run_id = Column(Integer, nullable=True, index=True)
    step_name = Column(String(255), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self) -> str:
        return f"<CallLog(id={self.id}, provider={self.provider}, tokens={self.total_tokens})>"
