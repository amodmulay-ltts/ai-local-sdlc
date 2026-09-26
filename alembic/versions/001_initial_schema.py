"""Initial schema: Project, ModelProfile, KnowledgeSource, Chunk, CallLog tables.

Revision ID: 001
Revises:
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Create initial schema."""
    # Create projects table
    op.create_table(
        'projects',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('knowledge_scope_policy', sa.String(length=50), nullable=False),
        sa.Column('model_policy', sa.String(length=50), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_projects_id'), 'projects', ['id'], unique=False)
    op.create_index(op.f('ix_projects_name'), 'projects', ['name'], unique=False)

    # Create model_profiles table
    op.create_table(
        'model_profiles',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('provider', sa.String(length=50), nullable=False),
        sa.Column('model_id', sa.String(length=255), nullable=False),
        sa.Column('endpoint', sa.String(length=512), nullable=True),
        sa.Column('api_key_ref', sa.String(length=255), nullable=True),
        sa.Column('temperature', sa.String(length=10), nullable=False),
        sa.Column('max_tokens', sa.Integer(), nullable=True),
        sa.Column('context_window', sa.Integer(), nullable=True),
        sa.Column('cost_class', sa.String(length=20), nullable=False),
        sa.Column('is_local', sa.Boolean(), nullable=False),
        sa.Column('is_embedding_model', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_model_profiles_id'), 'model_profiles', ['id'], unique=False)
    op.create_index(op.f('ix_model_profiles_name'), 'model_profiles', ['name'], unique=False)

    # Create knowledge_sources table
    op.create_table(
        'knowledge_sources',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('project_id', sa.Integer(), nullable=True),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('source_type', sa.String(length=50), nullable=False),
        sa.Column('source_uri', sa.String(length=512), nullable=False),
        sa.Column('visibility', sa.String(length=50), nullable=False),
        sa.Column('ingestion_status', sa.String(length=50), nullable=False),
        sa.Column('ingestion_error', sa.Text(), nullable=True),
        sa.Column('file_size_bytes', sa.Integer(), nullable=True),
        sa.Column('chunk_count', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_knowledge_sources_id'), 'knowledge_sources', ['id'], unique=False)
    op.create_index(op.f('ix_knowledge_sources_name'), 'knowledge_sources', ['name'], unique=False)
    op.create_index(op.f('ix_knowledge_sources_project_id'), 'knowledge_sources', ['project_id'], unique=False)

    # Create chunks table
    op.create_table(
        'chunks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('source_id', sa.Integer(), nullable=False),
        sa.Column('text', sa.Text(), nullable=False),
        sa.Column('page_number', sa.Integer(), nullable=True),
        sa.Column('section_title', sa.String(length=255), nullable=True),
        sa.Column('source_ref', sa.String(length=255), nullable=True),
        sa.Column('token_count', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_chunks_id'), 'chunks', ['id'], unique=False)
    op.create_index(op.f('ix_chunks_source_id'), 'chunks', ['source_id'], unique=False)

    # Create call_logs table
    op.create_table(
        'call_logs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('provider', sa.String(length=50), nullable=False),
        sa.Column('model_id', sa.String(length=255), nullable=False),
        sa.Column('input_tokens', sa.Integer(), nullable=True),
        sa.Column('output_tokens', sa.Integer(), nullable=True),
        sa.Column('total_tokens', sa.Integer(), nullable=True),
        sa.Column('estimated_cost', sa.String(length=20), nullable=True),
        sa.Column('latency_ms', sa.Integer(), nullable=True),
        sa.Column('playbook_run_id', sa.Integer(), nullable=True),
        sa.Column('step_name', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_call_logs_id'), 'call_logs', ['id'], unique=False)
    op.create_index(op.f('ix_call_logs_playbook_run_id'), 'call_logs', ['playbook_run_id'], unique=False)


def downgrade() -> None:
    """Drop all tables."""
    op.drop_table('call_logs')
    op.drop_table('chunks')
    op.drop_table('knowledge_sources')
    op.drop_table('model_profiles')
    op.drop_table('projects')
